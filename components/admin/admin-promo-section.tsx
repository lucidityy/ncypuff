"use client";

import { useState } from "react";
import { ChevronDown, Percent } from "lucide-react";

import { PromoManager } from "@/components/admin/promo-manager";
import { cn } from "@/lib/utils";

/** Bloc Promo repliable : clic → gestion des codes promo. */
export function AdminPromoSection(): JSX.Element {
  const [open, setOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl bg-surface neon-border">
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          setEverOpened(true);
        }}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-raised/40"
      >
        <span className="flex min-w-0 items-center gap-2">
          <Percent size={16} className="shrink-0 text-accent" aria-hidden />
          <span className="font-display text-sm tracking-wide text-foreground">Promo</span>
        </span>
        <ChevronDown
          size={18}
          className={cn("shrink-0 text-foreground-muted transition-transform duration-200", open && "rotate-180")}
          aria-hidden
        />
      </button>

      {everOpened ? (
        <div
          className={cn(
            "space-y-3 border-t border-accent/10 px-4 pb-4 pt-3",
            !open && "hidden"
          )}
          aria-hidden={!open}
        >
          <p className="text-2xs leading-relaxed text-foreground-muted">
            Offres vitrine : à venir. Ici : codes promo checkout (% , € ou échantillon g × produit).
          </p>
          <PromoManager embedded />
        </div>
      ) : null}
    </div>
  );
}
