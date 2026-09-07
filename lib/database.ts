import "server-only";
import { createClient, type Client } from "@libsql/client";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const shared = globalThis as typeof globalThis & {
  ancDatabase?: Promise<Client>;
};
export function databaseConfigured() {
  return (
    !process.env.VERCEL ||
    Boolean(
      process.env.TURSO_DATABASE_URL?.trim() &&
      process.env.TURSO_AUTH_TOKEN?.trim(),
    )
  );
}
export async function database(): Promise<Client> {
  if (!databaseConfigured()) throw new Error("DATABASE_NOT_CONFIGURED");
  if (!shared.ancDatabase) {
    shared.ancDatabase = (async () => {
      const remote = process.env.TURSO_DATABASE_URL?.trim();
      if (process.env.VERCEL && remote && !/^(libsql|https):\/\//.test(remote))
        throw new Error("A remote database URL is required on Vercel");
      const directory =
        process.env.DATA_DIRECTORY || path.join(process.cwd(), "data");
      if (!remote) await mkdir(directory, { recursive: true });
      const client = createClient({
        url: remote || pathToFileURL(path.join(directory, "anc.sqlite")).href,
        authToken: process.env.TURSO_AUTH_TOKEN?.trim() || undefined,
      });
      await client.batch(
        [
          "CREATE TABLE IF NOT EXISTS anc_store (id INTEGER PRIMARY KEY CHECK(id = 1), data TEXT NOT NULL)",
          "CREATE TABLE IF NOT EXISTS anc_rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires INTEGER NOT NULL)",
        ],
        "write",
      );
      return client;
    })().catch((error) => {
      shared.ancDatabase = undefined;
      throw error;
    });
  }
  return shared.ancDatabase;
}
