import { Home } from "@/components/website";
import { readStore } from "@/lib/store";
export const dynamic = "force-dynamic";
export default async function Page() {
  return (
    <Home products={(await readStore()).products.filter((p) => p.available)} />
  );
}
