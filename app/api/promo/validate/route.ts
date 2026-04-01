import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { applyPromoCode } from "@/lib/promo-apply";
import { getPromoCodes } from "@/lib/promo-repository";
import { getProducts } from "@/lib/products-repository";

const bodySchema = z.object({
  code: z.string(),
  subtotal: z.number().finite().nonnegative()
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON invalide" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Données invalides" }, { status: 400 });
  }

  const [records, products] = await Promise.all([getPromoCodes(), getProducts()]);
  const result = applyPromoCode(parsed.data.subtotal, parsed.data.code, records, products);

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 200 });
  }

  return NextResponse.json({
    ok: true,
    code: result.code,
    label: result.label,
    discountAmount: result.discountAmount,
    totalAfter: result.totalAfter,
    ...(result.sampleLine ? { sampleLine: result.sampleLine } : {})
  });
}
