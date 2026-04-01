import { NextRequest, NextResponse } from "next/server";

import { ADMIN_COOKIE_NAME, verifyAdminSession } from "@/lib/admin-session";
import { getAdminEnv } from "@/lib/admin-env";

export function adminConfigError(): NextResponse {
  return NextResponse.json(
    { error: "Configuration admin incomplète (ADMIN_PASSWORD, ADMIN_SESSION_SECRET)" },
    { status: 503 }
  );
}

export function adminUnauthorized(): NextResponse {
  return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
}

/** Returns a NextResponse to return early, or null if the request is authenticated. */
export function requireAdminApi(req: NextRequest): NextResponse | null {
  const env = getAdminEnv();
  if (!env) return adminConfigError();

  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!token || !verifyAdminSession(token, env.sessionSecret)) {
    return adminUnauthorized();
  }
  return null;
}
