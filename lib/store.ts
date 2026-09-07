import "server-only";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { initialProducts, type Enquiry, type Product } from "./data";

type Store = { products: Product[]; enquiries: Enquiry[] };
const directory =
  process.env.DATA_DIRECTORY || path.join(process.cwd(), "data");
const filename = path.join(directory, "store.json");
const globalStore = globalThis as typeof globalThis & {
  ancWriteQueue?: Promise<unknown>;
};
export async function readStore(): Promise<Store> {
  try {
    return JSON.parse(await readFile(filename, "utf8")) as Store;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT")
      return { products: structuredClone(initialProducts), enquiries: [] };
    throw error;
  }
}
export function mutateStore<T>(mutate: (store: Store) => T): Promise<T> {
  const task = (globalStore.ancWriteQueue || Promise.resolve()).then(
    async () => {
      const store = await readStore();
      const result = mutate(store);
      await mkdir(directory, { recursive: true });
      const temporary = `${filename}.${randomUUID()}.tmp`;
      await writeFile(temporary, JSON.stringify(store, null, 2), {
        mode: 0o600,
      });
      await rename(temporary, filename);
      return result;
    },
  );
  globalStore.ancWriteQueue = task.catch(() => undefined);
  return task;
}
