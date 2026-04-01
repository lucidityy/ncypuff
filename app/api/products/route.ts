import { NextResponse } from "next/server";

import { getProducts } from "@/lib/products-repository";

export async function GET(): Promise<NextResponse> {
  const products = await getProducts();
  return NextResponse.json(
    { products },
    { headers: { "Cache-Control": "no-store, must-revalidate" } }
  );
}
