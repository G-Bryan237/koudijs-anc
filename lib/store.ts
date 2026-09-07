import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { database, databaseConfigured } from "./database";
import { initialProducts, type Enquiry, type Product } from "./data";
import { expandedProducts, productImage } from "./product-catalog";

export type Store = { products: Product[]; enquiries: Enquiry[] };
const seeds = [...initialProducts, ...expandedProducts];
function migrate(store: Store): Store {
  const existing = new Map(store.products.map((p) => [p.id, p]));
  const products: Product[] = seeds.map((seed) => {
    const saved = existing.get(seed.id);
    return {
      ...seed,
      ...saved,
      image: productImage(seed.id),
      ...(seed.pelletSize ? { pelletSize: seed.pelletSize } : {}),
      ...(seed.family ? { family: seed.family } : {}),
    };
  });
  for (const p of store.products)
    if (!seeds.some((s) => s.id === p.id)) products.push(p);
  return { products, enquiries: store.enquiries };
}
function empty(): Store {
  return migrate({ products: [], enquiries: [] });
}
async function legacy(): Promise<Store> {
  // Never read local development records into a hosted environment.
  if (process.env.VERCEL) return empty();
  try {
    return migrate(
      JSON.parse(
        await readFile(
          path.join(
            process.env.DATA_DIRECTORY || path.join(process.cwd(), "data"),
            "store.json",
          ),
          "utf8",
        ),
      ),
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return empty();
    throw error;
  }
}
async function ensureSeed() {
  const db = await database();
  const found = await db.execute("SELECT id FROM anc_store WHERE id = 1");
  if (!found.rows.length)
    await db.execute({
      sql: "INSERT OR IGNORE INTO anc_store (id,data) VALUES (1,?)",
      args: [JSON.stringify(await legacy())],
    });
  return db;
}
export async function readStore(): Promise<Store> {
  // Keep public product discovery available until hosting is configured.
  // No customer requests are accepted or represented as saved in this state.
  if (!databaseConfigured()) return empty();
  const db = await ensureSeed();
  const result = await db.execute("SELECT data FROM anc_store WHERE id = 1");
  return migrate(JSON.parse(String(result.rows[0].data)));
}
export async function mutateStore<T>(mutate: (store: Store) => T): Promise<T> {
  const db = await ensureSeed();
  const tx = await db.transaction("write");
  try {
    const row = await tx.execute("SELECT data FROM anc_store WHERE id = 1");
    const store = migrate(JSON.parse(String(row.rows[0].data)));
    const value = mutate(store);
    await tx.execute({
      sql: "UPDATE anc_store SET data = ? WHERE id = 1",
      args: [JSON.stringify(store)],
    });
    await tx.commit();
    return value;
  } catch (error) {
    await tx.rollback();
    throw error;
  } finally {
    tx.close();
  }
}
