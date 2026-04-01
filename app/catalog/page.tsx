"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { FilterBar } from "@/components/product/filter-bar";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductsLoadGate } from "@/components/product/products-load-gate";
import { SearchBar } from "@/components/product/search-bar";
import { SectionTitle } from "@/components/shared/section-title";
import { useFilters } from "@/hooks/useFilters";
import { useProducts } from "@/hooks/useProducts";

function CatalogContent(): JSX.Element {
  const { products, loading, error, reload } = useProducts();
  const searchParams = useSearchParams();
  const {
    searchQuery, setSearchQuery,
    setActiveCategory,
    activeTag, setActiveTag,
    sortBy, setSortBy,
    availableTags, filteredProducts
  } = useFilters(products);

  useEffect(() => {
    const c = searchParams.get("category");
    const q = searchParams.get("q");
    if (c) setActiveCategory(c);
    if (q) setSearchQuery(q);
  }, [searchParams, setActiveCategory, setSearchQuery]);

  return (
    <div className="space-y-4 pt-4">
      <SectionTitle title="Catalogue" subtitle="Tous nos produits" />
      <ProductsLoadGate loading={loading} error={error} onRetry={reload}>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <FilterBar
          tags={availableTags}
          activeTag={activeTag}
          onTagChange={setActiveTag}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
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
