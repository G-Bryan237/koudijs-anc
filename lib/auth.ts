import "server-only";
import {
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { cookies } from "next/headers";
import { database, databaseConfigured } from "./database";

function credentialHash() {
  return process.env.ADMIN_PASSWORD_HASH?.trim() || "";
}
export function adminEmail() {
  return process.env.ADMIN_EMAIL?.trim().toLowerCase() || "";
}
export function configured() {
  return Boolean(
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail()) &&
    /^[a-f\d]{32}:[a-f\d]{128}$/i.test(credentialHash()) &&
    (process.env.SESSION_SECRET?.trim().length || 0) >= 32,
  );
}
export function verifyPassword(password: string) {
  const [salt, hash] = credentialHash().split(":");
  if (
    !/^[a-f\d]{32}$/i.test(salt || "") ||
    !/^[a-f\d]{128}$/i.test(hash || "") ||
    password.length > 256
  )
    return false;
  const expected = Buffer.from(hash, "hex"),
    actual = scryptSync(password, salt, 64);
  return timingSafeEqual(expected, actual);
}
function sign(value: string) {
  return createHmac("sha256", process.env.SESSION_SECRET?.trim() || "")
    .update(value)
    .digest("hex");
}
export function createSession() {
  const value =
    Date.now() + 8 * 60 * 60 * 1000 + "." + randomBytes(24).toString("hex");
  return value + "." + sign(value);
}
export async function authenticated() {
  if (!configured()) return false;
  const token = (await cookies()).get("anc_session")?.value;
  if (!token) return false;
  const pieces = token.split(".");
  if (pieces.length !== 3) return false;
  const [expires, nonce, signature] = pieces;
  if (
    !/^\d+$/.test(expires) ||
    !Number.isSafeInteger(Number(expires)) ||
    Number(expires) <= Date.now() ||
    !/^[a-f\d]{48}$/.test(nonce) ||
    !/^[a-f\d]{64}$/.test(signature)
  )
    return false;
  return timingSafeEqual(
    Buffer.from(sign(expires + "." + nonce), "hex"),
    Buffer.from(signature, "hex"),
  );
}
export function sameOrigin(request: Request) {
  const raw = request.headers.get("origin");
  if (!raw) return false;
  try {
    const origin = new URL(raw);
    if (origin.origin !== raw) return false;
    const allowed = new Set<string>();
    const site = process.env.SITE_URL?.trim();
    if (site) allowed.add(new URL(site).origin);
    // Vercel supplies these deployment-specific hosts; never allow arbitrary *.vercel.app.
    if (process.env.VERCEL) {
      for (const host of [
        process.env.VERCEL_URL,
        process.env.VERCEL_BRANCH_URL,
        process.env.VERCEL_PROJECT_PRODUCTION_URL,
      ])
        if (host) allowed.add("https://" + host.trim());
      const requestHost = request.headers.get("host");
      if (requestHost && !/[\s,/@\\]/.test(requestHost))
        allowed.add("https://" + requestHost);
    } else if (!site) {
      const url = new URL(request.url);
      const host = request.headers.get("host") || url.host;
      allowed.add(url.protocol + "//" + host);
    }
    return allowed.has(origin.origin);
  } catch {
    return false;
  }
}
const shared = globalThis as typeof globalThis & {
  ancLimits?: Map<string, { count: number; expires: number }>;
};
const limits = (shared.ancLimits ||= new Map());
export async function limited(request: Request, bucket: string, max: number) {
  const now = Date.now();
  const trusted =
    process.env.VERCEL === "1" || process.env.TRUST_PROXY === "true";
  const ip = trusted
    ? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    : "local";
  // Hash the IP before saving the temporary rate-limit key.
  const key =
    bucket +
    ":" +
    createHmac(
      "sha256",
      process.env.SESSION_SECRET?.trim() || "anc-local-rate-limit",
    )
      .update(ip)
      .digest("hex");
  if (databaseConfigured()) {
    const db = await database();
    const result = await db.batch(
      [
        { sql: "DELETE FROM anc_rate_limits WHERE expires <= ?", args: [now] },
        {
          sql: "INSERT INTO anc_rate_limits (key,count,expires) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=anc_rate_limits.count+1 RETURNING count",
          args: [key, now + 15 * 60 * 1000],
        },
      ],
      "write",
    );
    return Number(result[1].rows[0].count) > max;
  }
  // Login remains usable for diagnosing missing database settings.
  for (const [k, v] of limits) if (v.expires <= now) limits.delete(k);
  const entry = limits.get(key) || { count: 0, expires: now + 15 * 60 * 1000 };
  entry.count++;
  limits.set(key, entry);
  return entry.count > max;
}
