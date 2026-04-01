"use client";

import { motion } from "framer-motion";
import { Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";

import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/format";

interface ProductCardProps {
  product: Product;
  index?: number;
  onOrder?: () => void;
}

/* Flavor keyword → [color classes, emoji] */
const FLAVOR_MAP: Record<string, [string, string]> = {
  raisin:     ["bg-purple-500/15 text-purple-300", "🍇"],
  myrtille:   ["bg-blue-500/15 text-blue-300",     "🫐"],
  blueberry:  ["bg-blue-500/15 text-blue-300",     "🫐"],
  fraise:     ["bg-rose-500/15 text-rose-300",     "🍓"],
  strawberry: ["bg-rose-400/15 text-rose-300",     "🍓"],
  cerise:     ["bg-red-500/15 text-red-300",       "🍒"],
  cherry:     ["bg-red-500/15 text-red-300",       "🍒"],
  menthe:     ["bg-emerald-500/15 text-emerald-300","🌿"],
  mint:       ["bg-emerald-500/15 text-emerald-300","🌿"],
  gum:        ["bg-pink-500/15 text-pink-300",     "🍬"],
  bubble:     ["bg-pink-400/15 text-pink-300",     "🫧"],
  pastèque:   ["bg-red-400/15 text-red-300",       "🍉"],
  watermelon: ["bg-red-400/15 text-red-300",       "🍉"],
  mangue:     ["bg-orange-500/15 text-orange-300", "🥭"],
  mango:      ["bg-orange-500/15 text-orange-300", "🥭"],
  lush:       ["bg-cyan-500/15 text-cyan-300",     "🧊"],
  glace:      ["bg-sky-400/15 text-sky-300",       "🧊"],
  ice:        ["bg-sky-400/15 text-sky-300",       "🧊"],
  fruit:      ["bg-amber-500/15 text-amber-300",   "🍑"],
  space:      ["bg-violet-500/15 text-violet-300", "🪐"],
  vanille:    ["bg-yellow-500/15 text-yellow-300", "🍦"],
  vanilla:    ["bg-yellow-500/15 text-yellow-300", "🍦"],
  cola:       ["bg-amber-700/15 text-amber-400",   "🥤"],
  litchi:     ["bg-pink-300/15 text-pink-200",     "🌺"],
  lychee:     ["bg-pink-300/15 text-pink-200",     "🌺"],
  pêche:      ["bg-orange-300/15 text-orange-200", "🍑"],
  peach:      ["bg-orange-300/15 text-orange-200", "🍑"],
  blue:       ["bg-blue-400/15 text-blue-300",     "💙"],
  banana:     ["bg-yellow-400/15 text-yellow-300", "🍌"],
  citron:     ["bg-lime-400/15 text-lime-300",     "🍋"],
  lemon:      ["bg-lime-400/15 text-lime-300",     "🍋"],
  pomme:      ["bg-green-400/15 text-green-300",   "🍏"],
  apple:      ["bg-green-400/15 text-green-300",   "🍏"],
  café:       ["bg-stone-500/15 text-stone-300",   "☕"],
  coffee:     ["bg-stone-500/15 text-stone-300",   "☕"],
  coco:       ["bg-amber-200/15 text-amber-200",   "🥥"],
  coconut:    ["bg-amber-200/15 text-amber-200",   "🥥"],
  passion:    ["bg-fuchsia-400/15 text-fuchsia-300","💜"],
  ananas:     ["bg-yellow-300/15 text-yellow-300", "🍍"],
  pineapple:  ["bg-yellow-300/15 text-yellow-300", "🍍"],
};

function getFlavorStyle(flavor: string): [string, string] {
  const lower = flavor.toLowerCase();
  for (const [key, val] of Object.entries(FLAVOR_MAP)) {
    if (lower.includes(key)) return val;
  }
  return ["bg-accent/10 text-accent/80", "✨"];
}

function FlavorScroller({ flavors }: { flavors: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const update = () => {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    update();
    const el = ref.current;
    el?.addEventListener("scroll", update, { passive: true });
    return () => el?.removeEventListener("scroll", update);
  }, []);

  const scroll = (dir: "left" | "right") => {
    ref.current?.scrollBy({ left: dir === "right" ? 140 : -140, behavior: "smooth" });
  };

  return (
    <div className="relative -mx-4">
      {/* Left arrow */}
      {canLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-surface-raised/90 text-accent backdrop-blur-sm shadow-neon transition-all hover:bg-accent/20 active:scale-90"
          style={{ left: 4 }}
        >
          <ChevronLeft size={14} strokeWidth={2.5} />
        </button>
      )}

      {/* Right arrow */}
      {canRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute top-1/2 z-10 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-surface-raised/90 text-accent backdrop-blur-sm shadow-neon transition-all hover:bg-accent/20 active:scale-90"
          style={{ right: 4 }}
        >
          <ChevronRight size={14} strokeWidth={2.5} />
        </button>
      )}

      {/* Left fade */}
      {canLeft && (
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 z-[5] bg-gradient-to-r from-surface to-transparent" />
      )}
      {/* Right fade */}
      {canRight && (
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 z-[5] bg-gradient-to-l from-surface to-transparent" />
      )}

      <div
        ref={ref}
        className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-1"
      >
        {flavors.map((flavor) => {
          const [colorClass, emoji] = getFlavorStyle(flavor);
          return (
            <span
              key={flavor}
              className={`inline-flex shrink-0 items-center gap-1 rounded-xl px-3 py-1.5 text-[11px] font-semibold ${colorClass}`}
            >
              <span aria-hidden="true">{emoji}</span>
              {flavor}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export function ProductCard({ product, index = 0, onOrder }: ProductCardProps): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden rounded-3xl bg-surface"
      style={{ boxShadow: "0 0 0 1px rgba(168,85,247,0.12), 0 4px 24px rgba(0,0,0,0.4)" }}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-raised">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-smooth hover:scale-[1.03]"
        />
        {/* gradient bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />

        {/* Name overlay — bottom left */}
        <div className="absolute bottom-0 left-0 px-4 pb-4">
          <p className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-accent/70">
            {product.subtitle}
          </p>
          <h3 className="font-display text-2xl font-extrabold leading-none tracking-tight text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]">
            {product.name}
          </h3>
        </div>

        {/* Puffs — bottom right, stacked stat */}
        {product.puffs && (
          <div
            className="absolute bottom-3 right-3 flex flex-col items-center rounded-2xl px-3 py-2 text-center"
            style={{
              background: "rgba(168,85,247,0.18)",
              border: "1px solid rgba(168,85,247,0.35)",
              backdropFilter: "blur(8px)",
              boxShadow: "0 0 16px rgba(168,85,247,0.25)"
            }}
          >
            <Zap size={12} className="text-accent mb-0.5" strokeWidth={2.5} />
            <span className="font-display text-lg font-extrabold leading-none text-accent" style={{ textShadow: "0 0 12px rgba(168,85,247,0.6)" }}>
              {product.puffs}
            </span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-accent/70 mt-0.5">
              puffs
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="px-4 pb-4 pt-4 space-y-4">

        {/* Pricing */}
        {product.prices?.length > 0 && (
          <div className="flex gap-2.5">
            {product.prices.map((tier, i) => (
              <div
                key={tier.qty}
                className={`flex-1 flex flex-col items-center justify-center rounded-2xl py-3 ${
                  i === 0
                    ? "bg-accent/15 border border-accent/25"
                    : "bg-surface-raised border border-white/5"
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-foreground-muted">
                  {tier.qty === 1 ? "À l'unité" : `Pack ×${tier.qty}`}
                </span>
                <span className={`font-display text-xl font-extrabold ${i === 0 ? "text-accent neon-text" : "text-foreground"}`}>
                  {formatPrice(tier.price)}
                </span>
                {i === 1 && (
                  <span className="text-[10px] font-bold text-emerald-400 mt-0.5">
                    Économie !
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

        {/* Flavors */}
        {product.flavors?.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground-muted/50">
              {product.flavors.length} parfum{product.flavors.length > 1 ? "s" : ""} dispo
            </p>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
              {product.flavors.map((flavor) => {
                const [colorClass, emoji] = getFlavorStyle(flavor);
                return (
                  <span
                    key={flavor}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-semibold ${colorClass}`}
                  >
                    <span aria-hidden="true">{emoji}</span>
                    {flavor}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* CTA */}
        {onOrder && (
          <button
            onClick={onOrder}
            className="mt-1 w-full rounded-2xl bg-accent py-3.5 text-sm font-bold text-background shadow-neon transition-all duration-200 hover:shadow-neon-lg hover:brightness-110 active:scale-[0.97]"
          >
            Commander ce produit
          </button>
        )}
      </div>
    </motion.div>
  );
}
