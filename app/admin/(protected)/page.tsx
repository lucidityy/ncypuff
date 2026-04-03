"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus, Package } from "lucide-react";

import { SectionTitle } from "@/components/shared/section-title";
import { EmptyState } from "@/components/shared/empty-state";
import { AdminPasswordForm } from "@/components/admin/admin-password-form";
import { AdminPromoSection } from "@/components/admin/admin-promo-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchJson } from "@/lib/fetch-json";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/product";


export default function AdminPage(): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const result = await fetchJson<{ products?: Product[] }>("/api/products", { cache: "no-store" });
      if (cancelled) return;
      if (!result.ok) {
        setLoadError(result.error);
        setProducts([]);
      } else if (!Array.isArray(result.data.products)) {
        setLoadError("Données invalides");
        setProducts([]);
      } else {
        setLoadError(null);
        setProducts(result.data.products);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-4 px-4 pt-2 pb-24">
      <SectionTitle title="Admin" subtitle="Gestion des produits" />

      <Button asChild className="w-full gap-2 font-display text-sm font-bold tracking-wide shadow-neon">
        <Link href="/admin/product/new">
          <Plus size={20} strokeWidth={2.5} aria-hidden />
          Ajouter un article
        </Link>
      </Button>

      {loading && <p className="text-sm text-foreground-muted">Chargement…</p>}

      {!loading && loadError && (
        <p className="rounded-xl bg-red-400/10 px-3 py-2 text-sm font-semibold text-red-400">{loadError}</p>
      )}

      {!loading && !loadError && products.length === 0 && (
        <EmptyState
          icon={Package}
          title="Aucun produit"
          description="Ajoute ton premier produit pour commencer."
        />
      )}

      <div className="space-y-3">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/admin/product/${product.id}`}
            className="flex items-center gap-3 rounded-2xl bg-surface p-3 neon-border transition-colors hover:bg-surface/80"
          >
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-background">
              {product.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Package className="h-6 w-6 text-foreground-muted/30" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate font-display text-sm tracking-wide text-foreground">
                  {product.name}
                </h3>
                {product.featured && (
                  <Badge className="shrink-0 text-[9px]">À la une</Badge>
                )}
              </div>
              <p className="text-xs text-foreground-muted">{product.category}</p>
              <div className="mt-1 flex items-center gap-3">
                <span className="text-sm font-bold text-accent">
                  {formatPrice(product.price)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <section className="space-y-3">
        <SectionTitle title="Sécurité" subtitle="Connexion admin" />
        <AdminPasswordForm />
      </section>

      <AdminPromoSection />

      <Link
        href="/admin/product/new"
        aria-label="Ajouter un article"
        title="Ajouter un article"
        className="fixed bottom-20 right-4 z-40 flex h-14 max-w-[3.5rem] items-center overflow-hidden rounded-full bg-accent text-background shadow-neon transition-[max-width,box-shadow] duration-300 ease-out hover:max-w-[min(calc(100vw-2rem),15rem)] hover:shadow-neon-lg focus-visible:max-w-[min(calc(100vw-2rem),15rem)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-[0.97]"
      >
        <span className="flex size-14 shrink-0 items-center justify-center" aria-hidden>
          <Plus size={24} strokeWidth={2.5} />
        </span>
        <span className="truncate pr-3 font-display text-sm font-bold tracking-wide text-background">
          Ajouter un article
        </span>
      </Link>
    </div>
  );
}
