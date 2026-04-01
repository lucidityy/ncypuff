import { NextRequest, NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/require-admin-api";
import { productUpdateSchema } from "@/lib/validations/product";
import { uniqueSlug } from "@/lib/slug";
import { getProducts, saveProducts } from "@/lib/products-repository";
import type { Product } from "@/types/product";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const denied = requireAdminApi(req);
  if (denied) return denied;

  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const parsed = productUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const products = await getProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
  }

  const existing = products[idx];
  const updates = parsed.data;

  // Regenerate slug if name changed
  let slug = existing.slug;
  if (updates.name && updates.name !== existing.name) {
    const taken = new Set(products.filter((p) => p.id !== id).map((p) => p.slug));
    slug = uniqueSlug(updates.name, taken);
  }

  const updated: Product = {
    ...existing,
    ...updates,
    id: existing.id,
    slug,
    tags: (updates.tags ?? existing.tags) as Product["tags"]
  };

  products[idx] = updated;
  await saveProducts(products);
  return NextResponse.json({ product: updated });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const denied = requireAdminApi(req);
  if (denied) return denied;

  const { id } = await params;

  const products = await getProducts();
  const filtered = products.filter((p) => p.id !== id);

  if (filtered.length === products.length) {
    return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
  }

  await saveProducts(filtered);
  return NextResponse.json({ ok: true });
}
