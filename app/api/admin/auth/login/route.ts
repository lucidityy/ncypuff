import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getAdminEnv } from "@/lib/admin-env";
import { getEffectiveAdminPassword } from "@/lib/admin-password-repository";
import { ADMIN_COOKIE_NAME, signAdminSession, timingSafeStringEqual } from "@/lib/admin-session";
import { adminConfigError } from "@/lib/require-admin-api";

const bodySchema = z.object({
  username: z.string(),
  password: z.string()
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  const env = getAdminEnv();
  if (!env) return adminConfigError();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const { username, password } = parsed.data;
  const userOk = timingSafeStringEqual(username, env.username);
  const effectivePass = await getEffectiveAdminPassword(env.password);
  const passOk = timingSafeStringEqual(password, effectivePass);
  if (!userOk || !passOk) {
    return NextResponse.json({ error: "Identifiants incorrects" }, { status: 401 });
  }

  const token = signAdminSession(env.sessionSecret);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
  return res;
}
