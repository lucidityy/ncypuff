import { NextRequest, NextResponse } from "next/server";

import { getCategories, saveCategories } from "@/lib/products-repository";
import { requireAdminApi } from "@/lib/require-admin-api";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const denied = requireAdminApi(req);
  if (denied) return denied;

  const categories = await getCategories();
  return NextResponse.json(
    { categories },
    { headers: { "Cache-Control": "no-store, must-revalidate" } }
  );
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  const denied = requireAdminApi(req);
  if (denied) return denied;

  try {
    const body = await req.json();
    if (!Array.isArray(body.categories) || body.categories.some((c: unknown) => typeof c !== "string")) {
      return NextResponse.json({ error: "Format invalide" }, { status: 400 });
    }
    const cleaned = (body.categories as string[])
      .map((c) => c.trim())
      .filter((c) => c.length > 0);
    const unique = [...new Set(cleaned)];
    await saveCategories(unique);
    return NextResponse.json({ categories: unique });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
