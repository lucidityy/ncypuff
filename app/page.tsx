"use client";

import type { CSSProperties } from "react";
import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, X, MessageCircle, ChevronDown, AlertCircle, RefreshCw } from "lucide-react";

import { ProductCardCompact } from "@/components/product/product-card-compact";
import { useProductsContext } from "@/hooks/useProductsContext";
import { BRAND, CONTACT } from "@/lib/constants";
import { PUFF_TIERS } from "@/lib/puff-tiers";
import type { Product } from "@/types/product";

export default function HomePage(): JSX.Element {
  const { products, loading, error, reload } = useProductsContext();
  const [openTier, setOpenTier] = useState<string | null>(null);
  const [showOrder, setShowOrder] = useState(false);
  const [copied, setCopied] = useState(false);
  const reducedMotion = useRef(
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const productsByTier = useMemo(() => {
    const map = new Map<string, Product[]>();
    for (const product of products) {
      const key = product.puffs;
      const existing = map.get(key);
      if (existing) {
        existing.push(product);
      } else {
        map.set(key, [product]);
      }
    }
    return map;
  }, [products]);

  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.phone.replace(/\s/g, ""));
      setCopied(true);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  };
  useEffect(() => () => { if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current); }, []);

  return (
    <div className="space-y-5 pb-6">

      {/* ── Hero ── */}
      <div className="relative flex flex-col items-center gap-2 pt-4 pb-4 text-center">

        {/* Floating decorative icons */}
        {[
          { icon: "💨", x: "8%",  y: "10%", delay: "0s",    duration: "3.2s", size: "1.6rem", opacity: 0.45 },
          { icon: "🌿", x: "82%", y: "5%",  delay: "0.6s",  duration: "4s",   size: "1.2rem", opacity: 0.35 },
          { icon: "🧊", x: "90%", y: "55%", delay: "1s",    duration: "3.6s", size: "1.1rem", opacity: 0.3  },
          { icon: "🍒", x: "5%",  y: "60%", delay: "0.3s",  duration: "4.4s", size: "1.2rem", opacity: 0.35 },
          { icon: "⚡", x: "75%", y: "80%", delay: "1.4s",  duration: "3s",   size: "1rem",   opacity: 0.25 },
          { icon: "🍉", x: "18%", y: "85%", delay: "0.8s",  duration: "3.8s", size: "1.1rem", opacity: 0.3  },
          { icon: "💎", x: "88%", y: "28%", delay: "1.8s",  duration: "5s",   size: "1rem",   opacity: 0.2  },
          { icon: "🔥", x: "2%",  y: "35%", delay: "2s",    duration: "4.2s", size: "1rem",   opacity: 0.25 },
        ].map((item, i) => (
          <motion.span
            key={i}
            className="pointer-events-none absolute select-none"
            style={{ left: item.x, top: item.y, fontSize: item.size, opacity: item.opacity }}
            animate={reducedMotion.current ? {} : { y: [0, -10, 0], rotate: [-4, 4, -4] }}
            transition={{ duration: parseFloat(item.duration), delay: parseFloat(item.delay), repeat: Infinity, ease: "easeInOut" }}
          >
            {item.icon}
          </motion.span>
        ))}

        <div className="relative">
          <div className="absolute -inset-8 rounded-full bg-accent/10 blur-3xl" />
          <Image
            src={BRAND.logo}
            alt={BRAND.fullName}
            width={250}
            height={250}
            className="relative animate-float drop-shadow-[0_0_32px_rgba(168,85,247,0.4)]"
            priority
          />
        </div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight leading-none">
          <span className="gradient-text" style={{ letterSpacing: "-0.02em" }}>CATALOGUE PUFFS 💨</span>
        </h1>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground-muted/60">
          Choisis ton format
        </p>

        {/* Brand logos */}
        {(() => {
          const brands = [
            {
              src: "/brand/jnr-logo.png", alt: "JNR",
              bg: "rgba(255,255,255,0.92)",
              glow: ["rgba(96,165,250,0.7)", "rgba(96,165,250,0.15)"],
              glowColor: "96,165,250",
            },
            {
              src: "/brand/alfakher-logo.png", alt: "Al Fakher",
              bg: "rgba(20,15,35,0.9)",
              glow: ["rgba(251,191,36,0.6)", "rgba(251,191,36,0.12)"],
              glowColor: "251,191,36",
              border: "1px solid rgba(251,191,36,0.2)",
            },
            {
              src: "/brand/pablo-logo.png", alt: "Pablo",
              bg: "rgba(10,5,5,0.95)",
              glow: ["rgba(239,68,68,0.65)", "rgba(239,68,68,0.12)"],
              glowColor: "239,68,68",
              border: "1px solid rgba(239,68,68,0.25)",
            },
          ];
          return (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-2 flex items-center gap-3 px-2 py-2"
            >
              {brands.map((brand, i) => (
                <div key={brand.alt} className="flex items-center gap-3">
                  {i > 0 && <span className="text-foreground-muted/30 text-lg font-thin">×</span>}
                  <motion.div
                    className="rounded-xl px-3 py-1.5 cursor-pointer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      boxShadow: [
                        `0 0 14px rgba(${brand.glowColor},0.4), 0 0 32px rgba(${brand.glowColor},0.15)`,
                        `0 0 28px rgba(${brand.glowColor},0.8), 0 0 56px rgba(${brand.glowColor},0.35)`,
                        `0 0 14px rgba(${brand.glowColor},0.4), 0 0 32px rgba(${brand.glowColor},0.15)`,
                      ],
                    }}
                    transition={{
                      opacity: { delay: 0.4 + i * 0.15, duration: 0.4 },
                      scale: { delay: 0.4 + i * 0.15, duration: 0.4, type: "spring", bounce: 0.4 },
                      boxShadow: { delay: 0.9 + i * 0.2, duration: 2.2 + i * 0.3, repeat: Infinity, ease: "easeInOut" },
                    }}
                    whileHover={{ scale: 1.08 }}
                    style={{ background: brand.bg, border: brand.border }}
                  >
                    <Image
                      src={brand.src}
                      alt={brand.alt}
                      width={90}
                      height={36}
                      className="h-8 w-[80px] object-contain"
                    />
                  </motion.div>
                </div>
              ))}
            </motion.div>
          );
        })()}
      </div>

      {/* ── TAF Tiers ── */}
      <div className="space-y-2">
        {error && !loading && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-400/20 bg-red-400/5 px-4 py-6 text-center">
            <AlertCircle size={28} className="text-red-400/70" />
            <p className="text-sm font-semibold text-foreground-muted">Impossible de charger le catalogue</p>
            <button
              onClick={() => void reload()}
              className="flex items-center gap-2 rounded-xl bg-red-400/10 px-4 py-2 text-xs font-bold text-red-400 transition-all hover:bg-red-400/20"
            >
              <RefreshCw size={13} /> Réessayer
            </button>
          </div>
        )}
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-2xl bg-surface" />
            ))
          : PUFF_TIERS.map((tier, i) => {
              const tierProducts = productsByTier.get(tier.puffsKey) ?? [];
              const hasProducts = tierProducts.length > 0;
              const isOpen = openTier === tier.id;

              const glowColor = tier.brandColor;
              const glowRgb = glowColor.replace("#", "");
              const r = parseInt(glowRgb.slice(0, 2), 16);
              const g = parseInt(glowRgb.slice(2, 4), 16);
              const b = parseInt(glowRgb.slice(4, 6), 16);

              return (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className={`relative overflow-hidden rounded-2xl${hasProducts ? " tier-glow" : ""}`}
                  style={{
                    background: hasProducts
                      ? `rgba(${r},${g},${b},0.05)`
                      : "rgba(255,255,255,0.02)",
                    border: hasProducts
                      ? `1px solid rgba(${r},${g},${b},0.25)`
                      : "1px solid rgba(255,255,255,0.05)",
                    ...(hasProducts && {
                      "--glow-r": r,
                      "--glow-g": g,
                      "--glow-b": b,
                      animationDelay: `${i * 0.4}s`,
                    } as CSSProperties),
                  }}
                >
                  {/* Shimmer on mount */}
                  {hasProducts && (
                    <motion.div
                      className="pointer-events-none absolute inset-0 z-10"
                      initial={{ x: "-100%", opacity: 0.6 }}
                      animate={{ x: "200%", opacity: 0 }}
                      transition={{ delay: i * 0.04 + 0.2, duration: 0.7, ease: "easeOut" }}
                      style={{
                        background: `linear-gradient(105deg, transparent 30%, rgba(${r},${g},${b},0.25) 50%, transparent 70%)`,
                      }}
                    />
                  )}

                  {/* Row */}
                  <button
                    onClick={() => hasProducts && setOpenTier(isOpen ? null : tier.id)}
                    className={`relative flex w-full items-center gap-3 px-4 py-3 text-left transition-all duration-200 overflow-hidden ${
                      hasProducts
                        ? "cursor-pointer tier-shimmer"
                        : "cursor-default opacity-40"
                    }`}
                    style={{ animationDelay: `${i * 0.6}s` }}
                  >
                    {/* Emoji */}
                    <motion.span
                      className="text-2xl shrink-0 leading-none"
                      animate={hasProducts ? { scale: [1, 1.12, 1] } : {}}
                      transition={{ delay: i * 0.04 + 0.3, duration: 0.5, ease: "easeOut" }}
                      style={{ filter: hasProducts ? `drop-shadow(0 0 8px rgba(${r},${g},${b},0.7))` : "none" }}
                    >
                      {tier.emoji}
                    </motion.span>

                    {/* Label + brand */}
                    <div className="flex flex-1 min-w-0 items-center gap-2">
                      <span
                        className="font-display text-base font-extrabold tracking-tight"
                        style={{ color: hasProducts ? "#f0f0f0" : "#888" }}
                      >
                        {tier.label}
                      </span>
                      <span
                        className="font-display text-[10px] uppercase tracking-[0.18em]"
                        style={{ color: hasProducts ? tier.brandColor : "rgba(138,130,166,0.35)", fontWeight: 700 }}
                      >
                        {tier.brand}
                      </span>
                    </div>

                    {/* Right badge */}
                    <div className="shrink-0">
                      {hasProducts ? (
                        <div className="flex items-center gap-1.5">
                          <span
                            className="rounded-full px-2 py-0.5 text-[10px] font-extrabold"
                            style={{
                              background: "rgba(168,85,247,0.18)",
                              color: "#c084fc",
                              border: "1px solid rgba(168,85,247,0.3)",
                            }}
                          >
                            DISPO
                          </span>
                          <ChevronDown
                            size={15}
                            className="text-accent/60 transition-transform duration-300"
                            style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                          />
                        </div>
                      ) : (
                        <span className="text-[10px] font-semibold text-foreground-muted/30">
                          Bientôt
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Expanded products */}
                  <AnimatePresence initial={false}>
                    {isOpen && hasProducts && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div
                          className="px-3 pb-3 pt-2"
                          style={{ borderTop: "1px solid rgba(168,85,247,0.12)" }}
                        >
                          <div className={tierProducts.length === 1 ? "max-w-[200px] mx-auto" : "grid grid-cols-2 gap-2"}>
                            {tierProducts.map((product, j) => (
                              <ProductCardCompact
                                key={product.id}
                                product={product}
                                index={j}
                                onOrder={() => setShowOrder(true)}
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
      </div>

      {/* ── COMMANDER CTA ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.button
          onClick={() => setShowOrder(true)}
          className="relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl py-4 text-base font-extrabold tracking-wide text-white transition-all duration-200 hover:brightness-110 active:scale-[0.97]"
          animate={{
            boxShadow: [
              "0 0 20px rgba(168,85,247,0.4), 0 4px 16px rgba(0,0,0,0.3)",
              "0 0 48px rgba(168,85,247,0.85), 0 0 80px rgba(168,85,247,0.35), 0 4px 16px rgba(0,0,0,0.3)",
              "0 0 20px rgba(168,85,247,0.4), 0 4px 16px rgba(0,0,0,0.3)",
            ],
          }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)" }}
        >
          {/* Glass shimmer */}
          <motion.span
            className="pointer-events-none absolute inset-0"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.5 }}
            style={{
              background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)",
            }}
          />
          <span className="relative text-xl leading-none">📥</span>
          <span className="relative">Passe ta commande</span>
        </motion.button>
      </motion.div>

      {/* ── Order bottom sheet ── */}
      <AnimatePresence>
        {showOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm"
              onClick={() => setShowOrder(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: -20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-4 top-[20%] z-50 mx-auto max-w-sm rounded-3xl px-5 pt-6 pb-7"
              style={{
                background: "rgba(17,14,31,0.97)",
                boxShadow: "0 0 0 1px rgba(168,85,247,0.2), 0 24px 64px rgba(0,0,0,0.7), 0 0 40px rgba(168,85,247,0.18)",
                backdropFilter: "blur(24px)",
              }}
            >
              <div className="space-y-4">
                {/* Header row — title + close */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h2 className="font-display text-2xl font-extrabold tracking-tight gradient-text">
                      Passe ta commande
                    </h2>
                    <p className="text-xs text-foreground-muted">
                      Envoie-nous le produit et le parfum souhaités
                    </p>
                  </div>
                  <motion.button
                    onClick={() => setShowOrder(false)}
                    whileTap={{ scale: 0.88 }}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-foreground-muted"
                    style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)" }}
                  >
                    <X size={18} strokeWidth={2.5} />
                  </motion.button>
                </div>

                <a
                  href={CONTACT.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-base font-extrabold text-white transition-all active:scale-[0.97]"
                  style={{ background: "#25D366", boxShadow: "0 0 24px rgba(37,211,102,0.4)" }}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white shrink-0" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={CONTACT.smsUrl}
                    className="flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-foreground transition-all active:scale-[0.97]"
                    style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)" }}
                  >
                    <MessageCircle size={16} strokeWidth={2} />
                    SMS
                  </a>
                  <button
                    onClick={handleCopy}
                    className="flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-foreground transition-all active:scale-[0.97]"
                    style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)" }}
                  >
                    {copied ? <Check size={16} className="text-accent" /> : <Copy size={16} />}
                    {copied ? "Copié !" : CONTACT.phone}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
