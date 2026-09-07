import { cookies } from "next/headers";
import {
  adminEmail,
  configured,
  createSession,
  limited,
  sameOrigin,
  verifyPassword,
} from "@/lib/auth";
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return Response.json({ error: "Origin not allowed" }, { status: 403 });
  if (!configured())
    return Response.json(
      { error: "Admin credentials have not been configured." },
      { status: 503 },
    );
  let blocked: boolean;
  try {
    blocked = await limited(request, "login", 8);
  } catch {
    return Response.json(
      { error: "Authentication service unavailable" },
      { status: 503 },
    );
  }
  if (blocked)
    return Response.json(
      { error: "Too many attempts. Try again in 15 minutes." },
      { status: 429 },
    );
  const raw = await request.text();
  if (raw.length > 2000)
    return Response.json({ error: "Invalid credentials" }, { status: 400 });
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
  if (
    typeof data?.password !== "string" ||
    typeof data.email !== "string" ||
    data.email.trim().toLowerCase() !== adminEmail() ||
    !verifyPassword(data.password)
  )
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  (await cookies()).set("anc_session", createSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 8 * 60 * 60,
  });
  return Response.json({ ok: true });
}
export async function DELETE(request: Request) {
  if (!sameOrigin(request))
    return Response.json({ error: "Origin not allowed" }, { status: 403 });
  (await cookies()).delete("anc_session");
  return Response.json({ ok: true });
}
