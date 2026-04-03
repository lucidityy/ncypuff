"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { ProductGrid } from "@/components/product/product-grid";
import { ProductsLoadGate } from "@/components/product/products-load-gate";
import { SectionTitle } from "@/components/shared/section-title";
import { useProductsContext } from "@/hooks/useProductsContext";
import { useFilters } from "@/hooks/useFilters";

function CatalogContent(): JSX.Element {
  const { products, loading, error, reload } = useProductsContext();
  const searchParams = useSearchParams();
  const { setActiveCategory, filteredProducts } = useFilters(products);

  useEffect(() => {
    const c = searchParams.get("category");
    if (c) setActiveCategory(c);
  }, [searchParams, setActiveCategory]);

  return (
    <div className="space-y-4 pt-4">
      <SectionTitle title="Le Menu" subtitle="Toutes nos puffs & saveurs" />
      <ProductsLoadGate loading={loading} error={error} onRetry={reload}>
        <ProductGrid products={filteredProducts} />
      </ProductsLoadGate>
    </div>
  );
}

function CatalogFallback(): JSX.Element {
  return (
    <div className="space-y-4 pt-4">
      <p className="text-sm text-foreground-muted">Chargement du catalogue…</p>
    </div>
  );
}

export default function CatalogPage(): JSX.Element {
  return (
    <Suspense fallback={<CatalogFallback />}>
      <CatalogContent />
    </Suspense>
  );
}
