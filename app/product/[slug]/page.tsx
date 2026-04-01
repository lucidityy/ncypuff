"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, PackageX, ArrowLeft, PackageSearch, ShoppingBag, Zap, Droplets } from "lucide-react";

import { ProductGrid } from "@/components/product/product-grid";
import { ProductsLoadGate } from "@/components/product/products-load-gate";
import { QuantitySelector } from "@/components/cart/quantity-selector";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionTitle } from "@/components/shared/section-title";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useProducts } from "@/hooks/useProducts";
import { formatQuantity, formatPrice } from "@/lib/format";
import type { Product } from "@/types/product";

export default function ProductDetailPage(): JSX.Element {
  const params = useParams<{ slug: string }>();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const { products, loading, error, reload } = useProducts();

  const product = products.find((p) => p.slug === params.slug);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  }, [product, products]);

  return (
    <ProductsLoadGate loading={loading} error={error} onRetry={reload}>
      {!product ? (
        <EmptyState
          icon={PackageSearch}
          title="Produit introuvable"
          description="Ce produit n'existe pas ou n'est plus disponible."
        />
      ) : (
        <ProductDetailContent
          product={product}
          relatedProducts={relatedProducts}
          quantity={quantity}
          setQuantity={setQuantity}
          addItem={addItem}
        />
      )}
    </ProductsLoadGate>
  );
}

function ProductDetailContent({
  product,
  relatedProducts,
  quantity,
  setQuantity,
  addItem
}: {
  product: Product;
  relatedProducts: Product[];
  quantity: number;
  setQuantity: (n: number) => void;
  addItem: ReturnType<typeof useCart>["addItem"];
}): JSX.Element {

  const inStock = product.stock > 0;

  return (
    <motion.div
      className="space-y-5"
      initial={false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Link href="/catalog" className="inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-foreground-muted transition-colors hover:text-accent">
        <ArrowLeft size={14} /> Retour
      </Link>

      <div className="relative -mx-4 aspect-square overflow-hidden rounded-b-3xl bg-surface">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent" />

        {product.puffs && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-accent/90 px-2.5 py-1 text-[11px] font-extrabold text-background shadow-neon backdrop-blur-sm">
            <Zap size={11} strokeWidth={3} />
            {product.puffs} puffs
          </span>
        )}
      </div>

      <div className="space-y-2">
        <Badge>{product.category}</Badge>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
          {product.name}
        </h1>
        {product.subtitle && (
          <p className="text-xs font-semibold uppercase tracking-widest text-foreground-muted">
            {product.subtitle}
          </p>
        )}
        <p className="text-sm leading-relaxed text-foreground-muted">{product.shortDescription}</p>
      </div>

      {/* Tiered pricing */}
      {product.prices?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.prices.map((tier) => (
            <div
              key={tier.qty}
              className="flex items-baseline gap-1.5 rounded-2xl bg-accent/10 px-3.5 py-2 neon-border"
            >
              <span className="text-xs font-bold text-foreground-muted">{tier.qty}x</span>
              <span className="font-display text-lg font-extrabold text-accent neon-text">
                {formatPrice(tier.price)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Flavors */}
      {product.flavors?.length > 0 && (
        <div className="space-y-2 rounded-2xl bg-surface p-4 neon-border">
          <div className="flex items-center gap-1.5 text-foreground-muted">
            <Droplets size={14} strokeWidth={2} />
            <span className="text-xs font-bold uppercase tracking-widest">Parfums disponibles</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {product.flavors.map((flavor) => (
              <span
                key={flavor}
                className="rounded-full bg-surface-raised px-2.5 py-1 text-[11px] font-semibold text-foreground/80"
              >
                {flavor}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3 rounded-2xl bg-surface p-4 neon-border">
        <h2 className="font-display text-base font-bold tracking-tight text-accent">Détails</h2>
        <p className="text-sm leading-relaxed text-foreground-muted">{product.longDescription}</p>
        <div className="flex gap-4 border-t border-accent/10 pt-3">
          <div>
            <span className="text-xs font-semibold text-foreground-muted">Stock</span>
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
              {inStock ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
                  <span className="text-sm font-bold uppercase tracking-wide text-accent">EN STOCK</span>
                </>
              ) : (
                <>
                  <PackageX className="h-3.5 w-3.5 text-red-400" aria-hidden="true" />
                  <span className="text-sm font-bold text-red-400">Rupture</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-accent/20 bg-gradient-to-b from-surface to-surface-raised/90 p-4 shadow-glow neon-border">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <p className="text-2xs font-bold uppercase tracking-wider text-accent/90">Quantité</p>
            <p className="truncate font-display text-xl font-extrabold tabular-nums leading-tight text-foreground">
              {formatPrice(product.price * quantity)}
            </p>
            <p className="text-2xs text-foreground-muted">pour {formatQuantity(quantity)}</p>
          </div>
          <QuantitySelector quantity={quantity} onChange={setQuantity} max={product.stock} unit="" />
        </div>
        <Button
          type="button"
          size="lg"
          className="h-14 w-full gap-2.5 font-display text-base font-bold tracking-tight shadow-neon"
          onClick={() => addItem(product, quantity)}
          disabled={!inStock}
        >
          <ShoppingBag className="h-5 w-5 shrink-0" strokeWidth={2.2} aria-hidden="true" />
          Ajouter au panier
        </Button>
      </div>

      {product.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.tags.map((tag) => (
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
        </div>
      )}

      {relatedProducts.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-baseline justify-between">
            <SectionTitle title="Similaires" />
            <Link href="/catalog" className="text-sm font-bold text-accent">
              Voir tout →
            </Link>
          </div>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </motion.div>
  );
}
