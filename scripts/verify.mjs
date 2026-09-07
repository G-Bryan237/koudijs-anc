import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";
const access = readFileSync("data/ADMIN-ACCESS.txt", "utf8");
const email = access.match(/^Email: (.+)$/m)[1];
const password = access.match(/^Password: (.+)$/m)[1];
let cookie = "",
  id = "";
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
try {
  assert.equal(
    (await req("/api/admin")).status,
    401,
    "Admin data must be protected",
  );
  assert.equal(
    (await req("/api/admin", "PATCH", {})).status,
    401,
    "Admin writes must be protected",
  );
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
    "Cross-origin submission must fail",
  );
  assert.equal(
    (await req("/api/enquiries", "POST", {})).status,
    400,
    "Invalid enquiry must fail",
  );
  assert.equal(
    (
      await req("/api/admin/session", "POST", {
        email,
        password: "invalid-test-password",
      })
    ).status,
    401,
    "Invalid login must fail",
  );
  const login = await req("/api/admin/session", "POST", { email, password });
  assert.equal(login.status, 200, "Admin login");
  const session = login.headers.get("set-cookie");
  assert.match(session, /HttpOnly/i);
  assert.match(session, /SameSite=strict/i);
  cookie = session.split(";")[0];
  const initial = await (await req("/api/admin")).json();
  assert.equal(initial.products.length, 7);
  const response = await req("/api/enquiries", "POST", {
    name: "AUTOMATED VERIFICATION",
    phone: "+237600000000",
    location: "Test location",
    category: "aquaculture",
    product: "tilapia",
    quantity: "Test only",
    message: "Automated verification, not a customer request.",
    consent: true,
    locale: "en",
  });
  assert.equal(response.status, 201, "Enquiry submission");
  id = (await response.json()).id;
  let data = await (await req("/api/admin")).json();
  assert(
    data.enquiries.some((e) => e.id === id && e.status === "new"),
    "Enquiry persisted",
  );
  assert.equal(
    (
      await req("/api/admin", "PATCH", {
        type: "enquiry",
        id,
        status: "confirmed",
      })
    ).status,
    200,
  );
  data = await (await req("/api/admin")).json();
  assert(
    data.enquiries.some((e) => e.id === id && e.status === "confirmed"),
    "Order status persisted",
  );
  const p = data.products[0];
  assert.equal(
    (
      await req("/api/admin", "PATCH", {
        ...p,
        type: "product",
        available: false,
      })
    ).status,
    200,
  );
  assert.equal(
    (await req(`/produits/${p.id}`)).status,
    404,
    "Hidden product has no public page",
  );
  assert.equal(
    (await req("/api/admin", "PATCH", { ...p, type: "product" })).status,
    200,
  );
  assert.equal(
    (
      await req("/api/admin", "PATCH", {
        type: "enquiry",
        id,
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
        { type: "enquiry", id, status: "closed" },
        { Origin: "https://untrusted.example" },
      )
    ).status,
    401,
  );
  for (const path of [
    "/",
    "/produits",
    "/aquaculture",
    "/volaille",
    "/porcs",
    "/produits/tilapia",
    "/produits/poisson-chat",
    "/produits/poulets-de-chair",
    "/produits/pondeuses",
    "/produits/porcelets",
    "/produits/porcs-en-croissance",
    "/produits/truies",
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
  ]) {
    const page = await req(path);
    assert.equal(page.status, 200, path);
    assert.match(
      page.headers.get("x-robots-tag") || "",
      /noindex/,
      "Preview indexing blocked",
    );
  }
  const english = await req("/", "GET", undefined, {
    Cookie: "anc_locale=en; anc_theme=dark",
  });
  const html = await english.text();
  assert.match(html, /lang="en"/);
  assert.match(html, /data-theme="dark"/);
  assert.match(html, /for the farmers/);
  assert.equal((await req("/this-page-does-not-exist")).status, 404);
  assert.equal((await req("/api/admin/session", "DELETE")).status, 200);
  cookie = "";
  assert.equal((await req("/api/admin")).status, 401);
  console.log(
    "PASS: 28 routes, authentication, cookie flags, validation, CSRF checks, enquiry persistence, order status, product visibility, English/dark rendering, 404 and logout.",
  );
} finally {
  // Only remove this run’s synthetic enquiry. Keep all real customer records and credentials.
  if (id) {
    const file = process.env.DATA_DIRECTORY
      ? `${process.env.DATA_DIRECTORY}/store.json`
      : "data/store.json";
    const data = JSON.parse(readFileSync(file, "utf8"));
    data.enquiries = data.enquiries.filter((e) => e.id !== id);
    const p = data.products.find((p) => p.id === "tilapia");
    if (p) p.available = true;
    writeFileSync(file, JSON.stringify(data, null, 2));
  }
}
