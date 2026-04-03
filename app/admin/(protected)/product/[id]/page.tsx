"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, PackageSearch } from "lucide-react";

import { ProductForm, type ProductFormData } from "@/components/admin/product-form";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionTitle } from "@/components/shared/section-title";
import { fetchJson } from "@/lib/fetch-json";
import type { Product } from "@/types/product";

export default function EditProductPage(): JSX.Element {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError(null);
      const result = await fetchJson<{ products?: Product[] }>("/api/products", { cache: "no-store" });
      if (cancelled) return;
      if (!result.ok) {
        setLoadError(result.error);
        setProduct(null);
      } else if (!Array.isArray(result.data.products)) {
        setLoadError("Donn├®es invalides");
        setProduct(null);
      } else {
        setProduct(result.data.products.find((p) => p.id === params.id) ?? null);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  const handleSubmit = useCallback(async (data: ProductFormData) => {
    const res = await fetch(`/api/admin/products/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error ?? `Erreur ${res.status}`);
    }
    const result = await res.json();
    setProduct(result.product);
  }, [params.id]);

  const handleDelete = useCallback(async () => {
    const res = await fetch(`/api/admin/products/${params.id}`, {
      method: "DELETE"
    });
    if (!res.ok) {
      throw new Error("Erreur lors de la suppression");
    }
    router.push("/admin");
  }, [params.id, router]);

  if (loading) {
    return <p className="px-4 pt-8 text-sm text-foreground-muted">ChargementÔÇª</p>;
  }

  if (loadError) {
    return (
      <div className="space-y-4 px-4 pt-4">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground-muted transition-colors hover:text-accent"
        >
          <ArrowLeft size={14} /> Retour
        </Link>
        <p className="text-sm font-semibold text-red-400">{loadError}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="space-y-4 px-4 pt-4">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground-muted transition-colors hover:text-accent"
        >
          <ArrowLeft size={14} /> Retour
        </Link>
        <EmptyState
          icon={PackageSearch}
          title="Produit introuvable"
          description="Ce produit n'existe pas ou a ├®t├® supprim├®."
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4 pt-4 pb-24">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground-muted transition-colors hover:text-accent"
      >
        <ArrowLeft size={14} /> Retour
      </Link>
      <SectionTitle title="Modifier" subtitle={product.name} />
      <ProductForm
        initialData={product}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </div>
  );
}