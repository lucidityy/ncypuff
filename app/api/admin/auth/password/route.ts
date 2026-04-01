import { NextRequest, NextResponse } from "next/server";

import { getAdminEnv } from "@/lib/admin-env";
import {
  getEffectiveAdminPassword,
  setStoredAdminPassword
} from "@/lib/admin-password-repository";
import { requireAdminApi } from "@/lib/require-admin-api";
import { timingSafeStringEqual } from "@/lib/admin-session";
import { changeAdminPasswordSchema } from "@/lib/validations/admin-password";

export async function PUT(req: NextRequest): Promise<NextResponse> {
  const denied = requireAdminApi(req);
  if (denied) return denied;

  const env = getAdminEnv();
  if (!env) {
    return NextResponse.json({ error: "Configuration admin incomplète" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const parsed = changeAdminPasswordSchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Données invalides";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const { currentPassword, newPassword } = parsed.data;
  const effective = await getEffectiveAdminPassword(env.password);
  if (!timingSafeStringEqual(currentPassword, effective)) {
    return NextResponse.json({ error: "Mot de passe actuel incorrect" }, { status: 401 });
  }

  try {
    await setStoredAdminPassword(newPassword);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erreur d’enregistrement";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
