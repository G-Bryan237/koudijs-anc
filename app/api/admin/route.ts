import { authenticated, sameOrigin } from "@/lib/auth";
import { mutateStore, readStore } from "@/lib/store";
import { statuses } from "@/lib/data";
import { databaseConfigured } from "@/lib/database";
export async function GET() {
  if (!(await authenticated()))
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  return Response.json(await readStore(), {
    headers: { "Cache-Control": "no-store" },
  });
}
export async function PATCH(request: Request) {
  if (!sameOrigin(request) || !(await authenticated()))
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!databaseConfigured())
    return Response.json(
      { error: "Remote storage is not configured" },
      { status: 503 },
    );
  const raw = await request.text();
  if (raw.length > 8000)
    return Response.json({ error: "Request too large" }, { status: 413 });
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
  if (
    data?.type === "enquiry" &&
    typeof data.id === "string" &&
    statuses.includes(data.status)
  ) {
    const found = await mutateStore((store) => {
      const item = store.enquiries.find((e) => e.id === data.id);
      if (!item) return false;
      item.status = data.status;
      return true;
    });
    return Response.json({ ok: found }, { status: found ? 200 : 404 });
  }
  if (
    data?.type === "product" &&
    typeof data.id === "string" &&
    typeof data.available === "boolean" &&
    [
      data.name?.fr,
      data.name?.en,
      data.description?.fr,
      data.description?.en,
    ].every(
      (v) => typeof v === "string" && v.trim().length >= 3 && v.length <= 1500,
    )
  ) {
    const found = await mutateStore((store) => {
      const item = store.products.find((p) => p.id === data.id);
      if (!item) return false;
      item.name = { fr: data.name.fr.trim(), en: data.name.en.trim() };
      item.description = {
        fr: data.description.fr.trim(),
        en: data.description.en.trim(),
      };
      item.available = data.available;
      return true;
    });
    return Response.json({ ok: found }, { status: found ? 200 : 404 });
  }
  return Response.json({ error: "Invalid update" }, { status: 400 });
}
