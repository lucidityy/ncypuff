"use client";

import { Minus, Plus } from "lucide-react";

import { formatQuantity } from "@/lib/format";

interface QuantitySelectorProps {
  quantity: number;
  max?: number;
  onChange: (quantity: number) => void;
  /** Unité affichée / accessibilité (ex. "g", "ml") ; vide = quantité discrète. */
  unit?: string;
  /**
   * `stacked` : grand chiffre + unité (fiche produit).
   * `inline` : quantité formatée sur une ligne (panier).
   */
  layout?: "stacked" | "inline";
}

export function QuantitySelector({
  quantity,
  max,
  onChange,
  unit = "",
  layout = "stacked"
}: QuantitySelectorProps): JSX.Element {
  const atMin = quantity <= 1;
  const atMax = max !== undefined && quantity >= max;
  const unitLabel = unit || "unité";
  const ariaUnit = unit || "unités";

  if (layout === "inline") {
    return (
      <div
        role="group"
        aria-label={`Quantité : ${formatQuantity(quantity, unit)}`}
        className="inline-flex items-stretch rounded-2xl bg-gradient-to-b from-surface-raised/95 to-surface p-1 shadow-glow ring-1 ring-accent/30 neon-border"
      >
        <button
          type="button"
          onClick={() => onChange(quantity - 1)}
          disabled={atMin}
          aria-label={`Retirer 1 ${unitLabel}`}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-foreground-muted transition-all hover:bg-accent/15 hover:text-accent active:scale-95 disabled:pointer-events-none disabled:opacity-25"
        >
          <Minus size={17} strokeWidth={2.25} />
        </button>
        <div className="flex min-w-[4.25rem] max-w-[6rem] items-center justify-center px-2">
          <span
            aria-live="polite"
            className="text-center font-display text-base font-bold tabular-nums leading-none tracking-wide text-accent neon-text transition-colors duration-200 sm:text-lg"
          >
            {formatQuantity(quantity, unit)}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onChange(quantity + 1)}
          disabled={atMax}
          aria-label={`Ajouter 1 ${unitLabel}`}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-foreground-muted transition-all hover:bg-accent/15 hover:text-accent active:scale-95 disabled:pointer-events-none disabled:opacity-25"
        >
          <Plus size={17} strokeWidth={2.25} />
        </button>
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label={`Quantité en ${ariaUnit}`}
      className="inline-flex items-stretch rounded-2xl bg-gradient-to-b from-surface-raised to-surface p-1 shadow-glow ring-1 ring-accent/25 neon-border"
    >
      <button
        type="button"
        onClick={() => onChange(quantity - 1)}
        disabled={atMin}
        aria-label={`Retirer 1 ${unitLabel}`}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-foreground-muted transition-all hover:bg-accent/15 hover:text-accent active:scale-95 disabled:pointer-events-none disabled:opacity-25"
      >
        <Minus size={16} strokeWidth={2.25} />
      </button>
      <div className="flex min-w-[3rem] flex-col items-center justify-center px-2 sm:min-w-[3.25rem] sm:px-2.5">
        <span
          aria-live="polite"
          className="font-display text-2xl leading-none tabular-nums tracking-wide text-accent neon-text"
        >
          {quantity}
        </span>
        {unit ? (
          <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.22em] text-accent/55">
            {unit}
          </span>
        ) : null}
      </div>
      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        disabled={atMax}
        aria-label={`Ajouter 1 ${unitLabel}`}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-foreground-muted transition-all hover:bg-accent/15 hover:text-accent active:scale-95 disabled:pointer-events-none disabled:opacity-25"
      >
        <Plus size={16} strokeWidth={2.25} />
      </button>
    </div>
  );
}
