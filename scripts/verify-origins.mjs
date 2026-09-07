import assert from "node:assert/strict";
import ts from "typescript";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const compiledModule = { exports: {} };
const compiled = ts.transpileModule(readFileSync("lib/auth.ts", "utf8"), {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
new Function("require", "module", "exports", compiled)(
  (name) =>
    name === "server-only"
      ? {}
      : name === "next/headers"
        ? {}
        : name === "./database"
          ? {}
          : require(name),
  compiledModule,
  compiledModule.exports,
);
const { sameOrigin } = compiledModule.exports;
const keys = [
  "VERCEL",
  "VERCEL_URL",
  "VERCEL_BRANCH_URL",
  "VERCEL_PROJECT_PRODUCTION_URL",
  "SITE_URL",
];
const previous = Object.fromEntries(keys.map((k) => [k, process.env[k]]));
function request(origin, host = "anc-preview.vercel.app") {
  return new Request("http://internal:3000/api/admin/session", {
    headers: { host, ...(origin ? { origin } : {}) },
  });
}
try {
  for (const key of keys) delete process.env[key];
  process.env.VERCEL = "1";
  process.env.VERCEL_URL = "anc-preview.vercel.app";
  process.env.SITE_URL = "https://nutrition.example/";
  assert(
    sameOrigin(request("https://anc-preview.vercel.app")),
    "Preview origin behind HTTPS proxy",
  );
  assert(
    sameOrigin(request("https://nutrition.example", "nutrition.example")),
    "Normalize custom domain trailing slash",
  );
  assert(
    !sameOrigin(request("https://attacker.vercel.app")),
    "Reject unrelated Vercel tenant",
  );
  assert(
    !sameOrigin(request("https://nutrition.example.attacker.test")),
    "Reject suffix attack",
  );
  assert(!sameOrigin(request(null)), "Reject missing Origin");
  assert(
    !sameOrigin(request("http://anc-preview.vercel.app")),
    "Require HTTPS on Vercel",
  );
  delete process.env.VERCEL;
  delete process.env.SITE_URL;
  assert(
    sameOrigin(request("http://127.0.0.1:3000", "127.0.0.1:3000")),
    "Local development origin",
  );
  console.log(
    "PASS: Vercel HTTPS origins, custom-domain normalization, tenant isolation, missing-origin rejection and local development.",
  );
} finally {
  for (const key of keys) {
    if (previous[key] === undefined) delete process.env[key];
    else process.env[key] = previous[key];
  }
}
