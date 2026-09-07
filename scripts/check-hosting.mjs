import nextEnv from "@next/env";
const { loadEnvConfig } = nextEnv;
import { scryptSync, timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";
loadEnvConfig(process.cwd());
let failed = false;
function check(name, ok) {
  console.log((ok ? "OK   " : "FAIL ") + name);
  if (!ok) failed = true;
}
const hash = process.env.ADMIN_PASSWORD_HASH?.trim() || "",
  email = process.env.ADMIN_EMAIL?.trim().toLowerCase() || "";
check("ADMIN_EMAIL", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
check("ADMIN_PASSWORD_HASH format", /^[a-f\d]{32}:[a-f\d]{128}$/i.test(hash));
check("SESSION_SECRET", (process.env.SESSION_SECRET?.trim().length || 0) >= 32);
if (process.argv.includes("--vercel")) {
  check(
    "TURSO_DATABASE_URL (remote)",
    /^(libsql|https):\/\//.test(process.env.TURSO_DATABASE_URL?.trim() || ""),
  );
  check("TURSO_AUTH_TOKEN", !!process.env.TURSO_AUTH_TOKEN?.trim());
}
try {
  const access = readFileSync("data/ADMIN-ACCESS.txt", "utf8");
  const password = access.match(/^Password: (.+)$/m)?.[1].trim();
  const fileEmail = access
    .match(/^Email: (.+)$/m)?.[1]
    .trim()
    .toLowerCase();
  if (password && /^[a-f\d]{32}:[a-f\d]{128}$/i.test(hash)) {
    const [salt, digest] = hash.split(":");
    check(
      "Saved local login matches configured credentials",
      email === fileEmail &&
        timingSafeEqual(
          scryptSync(password, salt, 64),
          Buffer.from(digest, "hex"),
        ),
    );
  }
} catch {
  /* The local access file is deliberately absent from hosting. */
}
console.log(
  "No secrets have been printed. Vercel does not inherit .env.local: add the variables to the project and redeploy.",
);
process.exitCode = failed ? 1 : 0;
