"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

import type { Product } from "@/types/product";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps): JSX.Element {
  const { addItem } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const outOfStock = product.stock === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/product/${product.slug}`} className="group block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-surface neon-border">
          {/* eslint-disable-next-line @next/next/no-img-element -- external product URLs */}
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

          {product.featured && (
            <Badge className="absolute left-2.5 top-2.5 text-[10px] backdrop-blur-sm">
              A la une
            </Badge>
          )}

          {outOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
              <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-bold text-red-400">
                Rupture
              </span>
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 p-3">
            <div className="flex items-end justify-between gap-2">
              <div className="min-w-0 space-y-0.5">
                <p className="text-2xs font-bold uppercase tracking-widest text-accent/50">
                  {product.category}
                </p>
                <h3 className="truncate font-display text-sm leading-tight tracking-wide text-foreground sm:text-base">
                  {product.name}
                </h3>
                <p className="font-display text-base font-bold text-accent neon-text">
                  {formatPrice(product.price)}
                </p>
              </div>
              <button
                onClick={handleAdd}
                disabled={outOfStock}
                aria-label={`Ajouter ${product.name} au panier`}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-background shadow-neon transition-all duration-200 hover:shadow-neon-lg hover:scale-110 active:scale-95 disabled:opacity-0"
              >
                <Plus size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
