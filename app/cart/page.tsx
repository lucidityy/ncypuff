"use client";

import Link from "next/link";
import { Truck, ShoppingBag, ArrowRight } from "lucide-react";

import { CartItem } from "@/components/cart/cart-item";
import { PriceBlock } from "@/components/cart/price-block";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { DELIVERY_LABEL } from "@/lib/constants";

export default function CartPage(): JSX.Element {
  const { items, subtotal, removeItem, updateQuantity } = useCart();

  if (items.length === 0) {
    return (
      <div className="space-y-5 pt-4">
        <SectionTitle title="Panier" subtitle="Tes produits sélectionnés" />
        <EmptyState icon={ShoppingBag} title="Panier vide" description="Ajoute des produits depuis le catalogue." />
        <Button asChild className="w-full">
          <Link href="/catalog">Voir le catalogue</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-4">
      <SectionTitle title="Panier" subtitle="Vérifie avant de finaliser" />

      <div className="space-y-2">
        {items.map((item) => (
          <CartItem
            key={item.product.id}
            item={item}
            onQuantityChange={(q) => updateQuantity(item.product.id, q)}
            onRemove={() => removeItem(item.product.id)}
          />
        ))}
      </div>

      <div className="flex items-center gap-3 rounded-2xl bg-accent/10 px-4 py-3 neon-border">
        <Truck className="h-5 w-5 shrink-0 text-accent" strokeWidth={1.8} />
        <span className="text-sm font-bold text-accent">
          {DELIVERY_LABEL} — adresse requise au checkout
        </span>
      </div>

      <div className="rounded-2xl bg-surface p-4 neon-border">
        <PriceBlock label="Sous-total" amount={subtotal} large />
      </div>

      <Button asChild className="w-full">
        <Link href="/checkout">
          Continuer la commande
          <ArrowRight size={14} className="ml-1.5" />
        </Link>
      </Button>
    </div>
  );
}
