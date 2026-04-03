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
    const fields = parsed.error.flatten().fieldErrors;
    const msg = Object.entries(fields).map(([k, v]) => `${k}: ${v?.join(", ")}`).join(" | ");
    return NextResponse.json({ error: msg || "Données invalides" }, { status: 400 });
  }

  const products = await getProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
  }

  const existing = products[idx];
  if (!existing) {
    return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
  }

  const updates = parsed.data;

  // Regenerate slug if name changed
  let slug = existing.slug;
  if (updates.name && updates.name !== existing.name) {
    const taken = new Set(products.filter((p) => p.id !== id).map((p) => p.slug));
    slug = uniqueSlug(updates.name, taken);
  }

  const updated: Product = {
    ...existing,
    name: updates.name ?? existing.name,
    subtitle: updates.subtitle ?? existing.subtitle,
    category: updates.category ?? existing.category,
    shortDescription: updates.shortDescription ?? existing.shortDescription,
    longDescription: updates.longDescription ?? existing.longDescription,
    price: updates.price ?? existing.price,
    prices: updates.prices ?? existing.prices,
    puffs: updates.puffs ?? existing.puffs,
    flavors: updates.flavors ?? existing.flavors,
    image: updates.image ?? existing.image,
    featured: updates.featured ?? existing.featured,
    format: updates.format ?? existing.format,
    tags: (updates.tags ?? existing.tags) as Product["tags"],
    id: existing.id,
    slug
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
