import { randomBytes, scryptSync } from "node:crypto";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
if (existsSync(".env.local")) {
  console.log(
    "Existing .env.local preserved. Configure ADMIN_EMAIL, ADMIN_PASSWORD_HASH and SESSION_SECRET manually.",
  );
  process.exit(0);
}
const email = process.env.SETUP_ADMIN_EMAIL || "info@anc.cm";
const password = randomBytes(18).toString("base64url");
const salt = randomBytes(16).toString("hex");
const hash = scryptSync(password, salt, 64).toString("hex");
writeFileSync(
  ".env.local",
  `ADMIN_EMAIL=${email}\nADMIN_PASSWORD_HASH=${salt}:${hash}\nSESSION_SECRET=${randomBytes(48).toString("hex")}\n`,
  { mode: 0o600, flag: "wx" },
);
mkdirSync("data", { recursive: true });
writeFileSync(
  "data/ADMIN-ACCESS.txt",
  `LOCAL ADMIN ACCESS\n\nPage: http://localhost:3000/admin\nEmail: ${email}\nPassword: ${password}\n\nKeep this file private. It is excluded from git. Replace credentials before deployment.\n`,
  { mode: 0o600, flag: "wx" },
);
console.log(
  "Local admin configured. Credentials saved privately to data/ADMIN-ACCESS.txt.",
);
