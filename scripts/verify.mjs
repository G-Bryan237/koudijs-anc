import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createClient } from "@libsql/client";
import { pathToFileURL } from "node:url";
import path from "node:path";
import nextEnv from "@next/env";
nextEnv.loadEnvConfig(process.cwd());
const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";
assert(
  ["127.0.0.1", "localhost"].includes(new URL(base).hostname),
  "Run against a local test instance only",
);
assert(
  !process.env.TURSO_DATABASE_URL,
  "Run these mutation tests against local SQLite, not a remote customer database",
);
const db = createClient({
  url: pathToFileURL(
    path.join(
      process.env.DATA_DIRECTORY || path.join(process.cwd(), "data"),
      "anc.sqlite",
    ),
  ).href,
});
const access = readFileSync("data/ADMIN-ACCESS.txt", "utf8");
const email = access.match(/^Email: (.+)$/m)[1].trim();
const password = access.match(/^Password: (.+)$/m)[1].trim();
let cookie = "",
  productBefore = null;
const ids = [];
async function req(url, method = "GET", body, extra = {}) {
  return fetch(base + url, {
    method,
    headers: {
      Origin: base,
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
      ...extra,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
}
async function store() {
  return (await req("/api/admin")).json();
}
try {
  assert.equal((await req("/api/admin")).status, 401);
  assert.equal((await req("/api/admin", "PATCH", {})).status, 401);
  assert.equal(
    (
      await req(
        "/api/enquiries",
        "POST",
        {},
        { Origin: "https://untrusted.example" },
      )
    ).status,
    403,
  );
  assert.equal((await req("/api/enquiries", "POST", {})).status, 400);
  assert.equal((await req("/api/enquiries", "POST", null)).status, 400);
  assert.equal(
    (await req("/api/admin/session", "POST", { email, password: "invalid" }))
      .status,
    401,
  );
  const login = await req("/api/admin/session", "POST", {
    email: " " + email.toUpperCase() + " ",
    password,
  });
  assert.equal(
    login.status,
    200,
    "Login with case/whitespace-normalized email",
  );
  const session = login.headers.get("set-cookie");
  assert.match(session, /HttpOnly/i);
  assert.match(session, /SameSite=strict/i);
  cookie = session.split(";")[0];
  const initial = await store();
  assert.equal(initial.products.length, 15);
  assert(
    initial.products.every((p) => p.image?.startsWith("/images/products/")),
  );
  const payload = {
    name: "AUTOMATED VERIFICATION",
    phone: "+237600000000",
    location: "Test only",
    category: "aquaculture",
    product: "tilapia-demarrage",
    quantity: "Test only",
    message: "Automated verification, not a customer request.",
    consent: true,
    locale: "en",
  };
  // Concurrent submissions exercise the database transaction, not only sequential writes.
  const responses = await Promise.all([
    req("/api/enquiries", "POST", payload),
    req("/api/enquiries", "POST", {
      ...payload,
      product: "tilapia-croissance",
    }),
  ]);
  for (const response of responses) {
    assert.equal(response.status, 201, "Persist enquiry");
    ids.push((await response.json()).id);
  }
  let saved = await store();
  assert(
    ids.every((id) => saved.enquiries.some((e) => e.id === id)),
    "Concurrent submissions both persisted",
  );
  assert.equal(
    (
      await req("/api/admin", "PATCH", {
        type: "enquiry",
        id: ids[0],
        status: "confirmed",
      })
    ).status,
    200,
  );
  const disk = JSON.parse(
    String(
      (await db.execute("SELECT data FROM anc_store WHERE id=1")).rows[0].data,
    ),
  );
  assert(
    disk.enquiries.some((e) => e.id === ids[0] && e.status === "confirmed"),
    "Order persisted across separate database connections",
  );
  productBefore = initial.products.find((p) => p.id === "tilapia-demarrage");
  assert.equal(
    (
      await req("/api/admin", "PATCH", {
        ...productBefore,
        type: "product",
        available: false,
      })
    ).status,
    200,
  );
  assert.equal((await req("/produits/tilapia-demarrage")).status, 404);
  assert.equal(
    (await req("/api/admin", "PATCH", { ...productBefore, type: "product" }))
      .status,
    200,
  );
  assert.equal(
    (
      await req("/api/admin", "PATCH", {
        type: "enquiry",
        id: ids[0],
        status: "invented",
      })
    ).status,
    400,
  );
  assert.equal(
    (
      await req(
        "/api/admin",
        "PATCH",
        { type: "enquiry", id: ids[0], status: "closed" },
        { Origin: "https://untrusted.example" },
      )
    ).status,
    401,
  );
  const paths = [
    "/",
    "/produits",
    "/aquaculture",
    "/volaille",
    "/porcs",
    "/a-propos",
    "/contact",
    "/devis",
    "/livraison",
    "/conseils",
    "/conseils/preparer-sa-demande",
    "/conseils/lire-une-fiche-produit",
    "/conseils/recevoir-sa-livraison",
    "/confidentialite",
    "/conditions",
    "/credits",
    "/admin",
    "/icon.svg",
    "/favicon.ico",
    "/apple-icon.png",
    "/robots.txt",
    ...initial.products.map((p) => "/produits/" + p.id),
    ...new Set(initial.products.map((p) => p.image)),
  ];
  for (const url of paths) {
    const page = await req(url);
    assert.equal(page.status, 200, url);
  }
  const en = await (
    await req("/", "GET", undefined, {
      Cookie: "anc_locale=en; anc_theme=dark",
    })
  ).text();
  assert.match(en, /lang="en"/);
  assert.match(en, /data-theme="dark"/);
  assert.match(en, /for the farmers/);
  const contact = await (await req("/contact")).text();
  assert.match(contact, /maps.google.com\/maps/);
  assert.doesNotMatch(contact, /map-placeholder/);
  const loginHtml = await (
    await req("/admin", "GET", undefined, { Cookie: "" })
  ).text();
  assert.match(loginHtml, /admin-password/);
  assert.match(loginHtml, /Afficher le mot de passe|Show password/);
  assert.equal((await req("/this-page-does-not-exist")).status, 404);
  assert.equal((await req("/api/admin/session", "DELETE")).status, 200);
  cookie = "";
  assert.equal((await req("/api/admin")).status, 401);
  console.log(
    "PASS: " +
      paths.length +
      " pages/assets, 15 catalogue entries, normalized login, protected writes, concurrent enquiries, SQLite persistence, product visibility, order statuses, EN/dark rendering, automatic map and password toggle markup.",
  );
} finally {
  const tx = await db.transaction("write");
  try {
    const result = await tx.execute("SELECT data FROM anc_store WHERE id=1");
    if (result.rows.length) {
      const data = JSON.parse(String(result.rows[0].data));
      data.enquiries = data.enquiries.filter((e) => !ids.includes(e.id));
      if (productBefore) {
        const i = data.products.findIndex((p) => p.id === productBefore.id);
        if (i >= 0) data.products[i] = productBefore;
      }
      await tx.execute({
        sql: "UPDATE anc_store SET data=? WHERE id=1",
        args: [JSON.stringify(data)],
      });
    }
    await tx.commit();
  } catch (error) {
    await tx.rollback();
    throw error;
  } finally {
    tx.close();
    db.close();
  }
}
