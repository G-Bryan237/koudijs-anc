import "server-only";
import {
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { cookies } from "next/headers";

export function configured() {
  return Boolean(
    process.env.ADMIN_PASSWORD_HASH &&
    process.env.ADMIN_EMAIL &&
    process.env.SESSION_SECRET &&
    process.env.SESSION_SECRET.length >= 32,
  );
}
export function verifyPassword(password: string) {
  const [salt, hash] = (process.env.ADMIN_PASSWORD_HASH || "").split(":");
  if (!salt || !hash || password.length > 256) return false;
  const actual = Buffer.from(hash, "hex");
  const candidate = scryptSync(password, salt, 64);
  return (
    actual.length === candidate.length && timingSafeEqual(actual, candidate)
  );
}
function sign(value: string) {
  return createHmac("sha256", process.env.SESSION_SECRET || "")
    .update(value)
    .digest("hex");
}
export function createSession() {
  const value = `${Date.now() + 1000 * 60 * 60 * 8}.${randomBytes(24).toString("hex")}`;
  return `${value}.${sign(value)}`;
}
export async function authenticated() {
  if (!configured()) return false;
  const token = (await cookies()).get("anc_session")?.value;
  if (!token) return false;
  const [expires, nonce, signature] = token.split(".");
  if (!expires || !nonce || !signature || Number(expires) < Date.now())
    return false;
  const expected = Buffer.from(sign(`${expires}.${nonce}`));
  const actual = Buffer.from(signature);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const expected =
    process.env.SITE_URL ||
    `${new URL(request.url).protocol}//${request.headers.get("host") || new URL(request.url).host}`;
  return !!origin && origin === expected;
}
const globalLimits = globalThis as typeof globalThis & {
  ancLimits?: Map<string, { count: number; expires: number }>;
};
const limits = (globalLimits.ancLimits ||= new Map());
export function limited(request: Request, bucket: string, max: number) {
  const now = Date.now();
  for (const [key, value] of limits)
    if (value.expires < now) limits.delete(key);
  // Only trust forwarding headers when the deployment proxy is configured to overwrite them.
  const ip =
    process.env.TRUST_PROXY === "true"
      ? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        "unknown"
      : "local";
  const key = `${bucket}:${ip}`;
  const entry = limits.get(key) || { count: 0, expires: now + 15 * 60 * 1000 };
  entry.count += 1;
  limits.set(key, entry);
  return entry.count > max;
}
