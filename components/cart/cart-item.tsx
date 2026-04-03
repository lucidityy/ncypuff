"use client";

import { X } from "lucide-react";

import type { CartItem as CartItemType } from "@/types/cart";
import { formatPrice } from "@/lib/format";
import { QuantitySelector } from "./quantity-selector";

interface CartItemProps {
  item: CartItemType;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

export function CartItem({ item, onQuantityChange, onRemove }: CartItemProps): JSX.Element {
  const lineTotal = item.product.price * item.quantity;

  return (
    <div className="flex gap-3 rounded-2xl bg-surface p-3 neon-border ring-1 ring-accent/5">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-raised ring-1 ring-border/30">
        {/* eslint-disable-next-line @next/next/no-img-element -- remote product URLs from blob */}
        <img
          src={item.product.image}
          alt={item.product.name}
          className="absolute inset-0 h-full w-full object-cover object-center"
          loading="lazy"
          decoding="async"
          sizes="64px"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-accent/60">
              {item.product.category}
            </p>
            <h4 className="truncate font-display text-sm tracking-wide text-foreground">
              {item.product.name}
            </h4>
            <p className="mt-0.5 text-2xs text-foreground-muted">
              {formatPrice(item.product.price)}
            </p>
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Retirer ${item.product.name} du panier`}
            className="shrink-0 rounded-full p-1.5 text-foreground-muted transition-colors hover:bg-red-500/15 hover:text-red-400"
          >
            <X size={15} strokeWidth={2} />
          </button>
        </div>

        <div className="flex flex-col gap-2 border-t border-accent/10 pt-2.5">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <p className="text-2xs font-bold uppercase tracking-wider text-foreground-muted">Quantité</p>
              <QuantitySelector
                layout="inline"
                quantity={item.quantity}
                max={99}
                onChange={onQuantityChange}
                unit="g"
              />
            </div>
            <div className="shrink-0 text-right">
              <p className="text-2xs font-bold uppercase tracking-wider text-foreground-muted">Total ligne</p>
              <p className="mt-0.5 font-display text-lg leading-none tabular-nums text-accent neon-text">
                {formatPrice(lineTotal)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
