import { randomUUID } from "node:crypto";
import { limited, sameOrigin } from "@/lib/auth";
import { mutateStore, readStore } from "@/lib/store";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return Response.json({ error: "Origin not allowed" }, { status: 403 });
  if (limited(request, "enquiry", 10))
    return Response.json({ error: "Please try again later." }, { status: 429 });
  const raw = await request.text();
  if (raw.length > 12000)
    return Response.json({ error: "Request too large" }, { status: 413 });
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!data || typeof data !== "object" || Array.isArray(data))
    return Response.json({ error: "Invalid request" }, { status: 400 });
  const clean = (key: string, max: number) =>
    typeof data?.[key] === "string" ? data[key].trim().slice(0, max) : "";
  const name = clean("name", 100),
    phone = clean("phone", 30),
    location = clean("location", 150),
    message = clean("message", 2000),
    product = clean("product", 80),
    category = clean("category", 30);
  if (data.website)
    return Response.json({ error: "Invalid request" }, { status: 400 });
  if (
    name.length < 2 ||
    !/^[+\d\s().-]{7,30}$/.test(phone) ||
    location.length < 2 ||
    message.length < 5 ||
    data.consent !== true ||
    !["aquaculture", "volaille", "porcs", "autre"].includes(category)
  )
    return Response.json(
      { error: "Please check your details and privacy consent." },
      { status: 400 },
    );
  if (
    product &&
    !(await readStore()).products.some((p) => p.id === product && p.available)
  )
    return Response.json({ error: "Unknown product" }, { status: 400 });
  const id = `ANC-${randomUUID().slice(0, 8).toUpperCase()}`;
  await mutateStore((store) =>
    store.enquiries.unshift({
      id,
      name,
      phone,
      location,
      message,
      product,
      category,
      quantity: clean("quantity", 100),
      locale: data.locale === "en" ? "en" : "fr",
      createdAt: new Date().toISOString(),
      status: "new",
    }),
  );
  return Response.json({ id }, { status: 201 });
}
