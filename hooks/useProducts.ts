"use client";

import { useCallback, useEffect, useState } from "react";

import { fetchJson } from "@/lib/fetch-json";
import type { Product } from "@/types/product";

export function useProducts(): {
  products: Product[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
} {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    const result = await fetchJson<{ products?: Product[] }>("/api/products", {
      cache: "no-store"
    });
    if (!result.ok) {
      setError(result.error);
      setProducts([]);
    } else if (!Array.isArray(result.data.products)) {
      setError("Invalid data");
      setProducts([]);
    } else {
      setProducts(result.data.products);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { products, loading, error, reload };
}
