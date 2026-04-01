import { randomUUID } from "crypto";

import { NextRequest, NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/require-admin-api";
import { productCreateSchema } from "@/lib/validations/product";
import { uniqueSlug } from "@/lib/slug";
import { getProducts, saveProducts } from "@/lib/products-repository";
import type { Product } from "@/types/product";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const denied = requireAdminApi(req);
  if (denied) return denied;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const parsed = productCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const products = await getProducts();
  const taken = new Set(products.map((p) => p.slug));
  const slug = uniqueSlug(parsed.data.name, taken);
  const id = `p-${randomUUID()}`;

  const newProduct: Product = {
    id,
    slug,
    name: parsed.data.name,
    category: parsed.data.category,
    shortDescription: parsed.data.shortDescription,
    longDescription: parsed.data.longDescription ?? "",
    price: parsed.data.price,
    image: parsed.data.image || "",
    stock: parsed.data.stock,
    featured: parsed.data.featured ?? false,
    format: parsed.data.format ?? "",
    tags: (parsed.data.tags ?? []) as Product["tags"]
  };

  products.push(newProduct);
  await saveProducts(products);
  return NextResponse.json({ product: newProduct }, { status: 201 });
}
