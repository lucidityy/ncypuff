"use client";

import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/format";

interface ProductCardCompactProps {
  product: Product;
  index?: number;
  onOrder?: () => void;
}

/** Flavor keyword → emoji (subset of full map, for compact display) */
const FLAVOR_EMOJI: [string, string][] = [
  ["watermelon", "🍉"], ["pastèque", "🍉"],
  ["strawberry", "🍓"], ["fraise", "🍓"],
  ["mango", "🥭"],     ["mangue", "🥭"],
  ["mint", "🌿"],      ["menthe", "🌿"],
  ["ice", "🧊"],       ["glace", "🧊"],
  ["blueberry", "🫐"], ["myrtille", "🫐"],
  ["cherry", "🍒"],    ["cerise", "🍒"],
  ["bubble", "🫧"],    ["gum", "🍬"],
  ["banana", "🍌"],    ["lemon", "🍋"], ["citron", "🍋"],
  ["peach", "🍑"],     ["pêche", "🍑"],
  ["lychee", "🌺"],    ["litchi", "🌺"],
  ["cola", "🥤"],      ["vanilla", "🍦"], ["vanille", "🍦"],
  ["passion", "💜"],   ["pineapple", "🍍"], ["ananas", "🍍"],
  ["blue", "💙"],
];

/** Flavor keyword → [emoji, bg color] */
const FLAVOR_COLORS: [string, string][] = [
  ["watermelon", "rgba(239,68,68,0.12)"],   ["pastèque", "rgba(239,68,68,0.12)"],
  ["strawberry", "rgba(244,63,94,0.12)"],   ["fraise", "rgba(244,63,94,0.12)"],
  ["cherry", "rgba(220,38,38,0.12)"],        ["cerise", "rgba(220,38,38,0.12)"],
  ["mango", "rgba(251,146,60,0.12)"],        ["mangue", "rgba(251,146,60,0.12)"],
  ["peach", "rgba(249,115,22,0.12)"],        ["pêche", "rgba(249,115,22,0.12)"],
  ["banana", "rgba(234,179,8,0.12)"],        ["citron", "rgba(234,179,8,0.12)"], ["lemon", "rgba(234,179,8,0.12)"],
  ["pineapple", "rgba(234,179,8,0.12)"],     ["ananas", "rgba(234,179,8,0.12)"],
  ["blueberry", "rgba(99,102,241,0.14)"],    ["myrtille", "rgba(99,102,241,0.14)"],
  ["grape", "rgba(139,92,246,0.14)"],        ["raisin", "rgba(139,92,246,0.14)"],
  ["lychee", "rgba(236,72,153,0.12)"],       ["litchi", "rgba(236,72,153,0.12)"],
  ["passion", "rgba(168,85,247,0.12)"],
  ["mint", "rgba(52,211,153,0.12)"],         ["menthe", "rgba(52,211,153,0.12)"],
  ["ice", "rgba(147,197,253,0.10)"],         ["glace", "rgba(147,197,253,0.10)"],
  ["cola", "rgba(120,53,15,0.18)"],
  ["bubble", "rgba(251,207,232,0.08)"],      ["gum", "rgba(251,207,232,0.08)"],
  ["vanilla", "rgba(253,230,138,0.10)"],     ["vanille", "rgba(253,230,138,0.10)"],
  ["coconut", "rgba(255,255,255,0.06)"],
  ["blue", "rgba(59,130,246,0.12)"],
];

function getFlavorEmoji(flavor: string): string {
  const lower = flavor.toLowerCase();
  for (const [key, emoji] of FLAVOR_EMOJI) {
    if (lower.includes(key)) return emoji;
  }
  return "✨";
}

function getFlavorBg(flavor: string): string {
  const lower = flavor.toLowerCase();
  for (const [key, color] of FLAVOR_COLORS) {
    if (lower.includes(key)) return color;
  }
  return "rgba(255,255,255,0.04)";
}

export function ProductCardCompact({
  product,
  index = 0,
  onOrder
}: ProductCardCompactProps): JSX.Element {
  const shineDelay = `${index * 1.2}s`;
  const glowDelay  = `${index * 0.75}s`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden rounded-2xl bg-surface flex flex-col card-glow-pulse"
      style={{ animationDelay: glowDelay }}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-surface-raised">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-smooth hover:scale-[1.04]"
            style={{ objectPosition: `center ${product.imagePosition ?? "50%"}` }}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-foreground-muted/20">
            <ShoppingBag size={32} strokeWidth={1} />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface/90 via-surface/20 to-transparent" />

        {/* Light sweep ray */}
        <div className="card-shine-overlay" style={{ "--shine-delay": shineDelay } as React.CSSProperties}>
          <div style={{ animationDelay: shineDelay, position: "absolute", inset: 0,
            background: "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.07) 40%, rgba(255,255,255,0.13) 50%, rgba(255,255,255,0.07) 60%, transparent 80%)",
            animation: `card-shine 5s ease-in-out ${shineDelay} infinite`,
            willChange: "transform"
          }} />
        </div>

        {/* Puffs badge */}
        {product.puffs && (
          <div
            className="absolute top-2 right-2 flex items-center gap-0.5 rounded-lg px-2 py-1 badge-spark"
            style={{
              background: "rgba(168,85,247,0.22)",
              border: "1px solid rgba(168,85,247,0.35)",
              backdropFilter: "blur(6px)",
              animationDelay: glowDelay
            }}
          >
            <span className="font-display text-xs font-extrabold text-accent" style={{ textShadow: "0 0 8px rgba(168,85,247,0.7)" }}>
              {product.puffs}
            </span>
          </div>
        )}

        {/* Name bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-3 pb-2.5">
          <p className="font-display text-sm font-extrabold leading-tight text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)] line-clamp-2">
            {product.name}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 gap-2.5 px-3 pt-2.5 pb-3">
        {/* Price */}
        <div className="flex items-baseline justify-between">
          <span className="font-display text-lg font-extrabold text-accent neon-text">
            {formatPrice(product.price)}
          </span>
          {product.prices && product.prices.length > 1 && (
            <span className="text-[10px] font-semibold text-emerald-400">
              Pack dispo
            </span>
          )}
        </div>

        {/* Flavors — all visible */}
        {product.flavors && product.flavors.length > 0 && (
          <div className="flex flex-col gap-1">
            {product.flavors.map((f) => (
              <div
                key={f}
                className="flex items-center gap-1.5 rounded-lg px-2 py-1"
                style={{ background: getFlavorBg(f) }}
              >
                <span className="text-sm leading-none" aria-hidden="true">{getFlavorEmoji(f)}</span>
                <span className="text-[11px] font-semibold text-foreground/90 leading-tight">{f}</span>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        {onOrder && (
          <button
            onClick={onOrder}
            className="mt-auto w-full rounded-xl py-2 text-xs font-bold text-white btn-shimmer shadow-neon transition-all hover:shadow-neon-lg active:scale-[0.97]"
            style={{ animationDelay: glowDelay }}
          >
            Commander
          </button>
        )}
      </div>
    </motion.div>
  );
}
