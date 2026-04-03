"use client";

import { createContext, useContext, useCallback, useEffect, useState, useMemo, type ReactNode } from "react";

import { fetchJson } from "@/lib/fetch-json";
import type { Product } from "@/types/product";

interface ProductsContextValue {
  products: Product[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextValue | null>(null);

export function ProductsProvider({ children }: { children: ReactNode }): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    const result = await fetchJson<{ products?: Product[] }>("/api/products", { cache: "no-store" });
    if (!result.ok) {
      setError(result.error);
      setProducts([]);
    } else if (!Array.isArray(result.data.products)) {
      setError("Données invalides");
      setProducts([]);
    } else {
      setProducts(result.data.products);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => { void reload(); }, [reload]);

  const value = useMemo<ProductsContextValue>(
    () => ({ products, loading, error, reload }),
    [products, loading, error, reload]
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

/** Use inside ProductsProvider — throws if used outside */
export function useProductsContext(): ProductsContextValue {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProductsContext must be used within ProductsProvider");
  return ctx;
}
