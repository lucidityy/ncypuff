import { NextRequest, NextResponse } from "next/server";

import { getPromoCodes, savePromoCodes } from "@/lib/promo-repository";
import { requireAdminApi } from "@/lib/require-admin-api";
import { promoCodesPayloadSchema } from "@/lib/validations/promo";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const denied = requireAdminApi(req);
  if (denied) return denied;

  const promoCodes = await getPromoCodes();
  return NextResponse.json(
    { promoCodes },
    { headers: { "Cache-Control": "no-store, must-revalidate" } }
  );
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  const denied = requireAdminApi(req);
  if (denied) return denied;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const parsed = promoCodesPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const codes = parsed.data.promoCodes.map((p) => p.code);
  const unique = new Set(codes);
  if (unique.size !== codes.length) {
    return NextResponse.json({ error: "Codes promo en double" }, { status: 400 });
  }

  await savePromoCodes(parsed.data.promoCodes);
  return NextResponse.json({ promoCodes: parsed.data.promoCodes });
}
