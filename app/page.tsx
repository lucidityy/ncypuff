"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, X, MessageCircle, ChevronDown } from "lucide-react";
import { useState, useMemo } from "react";

import { ProductCardCompact } from "@/components/product/product-card-compact";
import { useProducts } from "@/hooks/useProducts";
import { BRAND } from "@/lib/constants";
import { PUFF_TIERS } from "@/lib/puff-tiers";
import type { Product } from "@/types/product";

const PHONE = "07 47 34 64 19";
const WHATSAPP_URL = "https://wa.me/message/6S23V2YKFYE4E1";

export default function HomePage(): JSX.Element {
  const { products, loading } = useProducts();
  const [openTier, setOpenTier] = useState<string | null>(null);
  const [showOrder, setShowOrder] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PHONE.replace(/\s/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  };

  return (
    <div className="space-y-5 pb-6">

      {/* ── Hero ── */}
      <div className="flex flex-col items-center gap-2 pt-4 pb-1 text-center">
        <div className="relative">
          <div className="absolute -inset-8 rounded-full bg-accent/10 blur-3xl" />
          <Image
            src={BRAND.logo}
            alt={BRAND.fullName}
            width={130}
            height={130}
            className="relative animate-float drop-shadow-[0_0_32px_rgba(168,85,247,0.4)]"
            priority
          />
        </div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight leading-none">
          <span className="gradient-text">CATALOGUE PUFFS 💨</span>
        </h1>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground-muted/60">
          Choisis ton format
        </p>
      </div>

      {/* ── TAF Tiers ── */}
      <div className="space-y-2">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-2xl bg-surface" />
            ))
          : PUFF_TIERS.map((tier, i) => {
              const tierProducts = productsByTier.get(tier.puffsKey) ?? [];
              const hasProducts = tierProducts.length > 0;
              const isOpen = openTier === tier.id;

              return (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden rounded-2xl"
                  style={{
                    background: hasProducts
                      ? "rgba(168,85,247,0.06)"
                      : "rgba(255,255,255,0.02)",
                    border: hasProducts
                      ? "1px solid rgba(168,85,247,0.2)"
                      : "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  {/* Row */}
                  <button
                    onClick={() => hasProducts && setOpenTier(isOpen ? null : tier.id)}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-all duration-200 ${
                      hasProducts
                        ? "hover:bg-accent/5 active:bg-accent/10 cursor-pointer"
                        : "cursor-default opacity-40"
                    }`}
                  >
                    {/* Emoji */}
                    <span
                      className="text-2xl shrink-0 leading-none"
                      style={{ filter: hasProducts ? "drop-shadow(0 0 8px rgba(168,85,247,0.5))" : "none" }}
                    >
                      {tier.emoji}
                    </span>

                    {/* Label + brand */}
                    <div className="flex flex-1 min-w-0 items-baseline gap-2">
                      <span
                        className="font-display text-base font-extrabold tracking-tight"
                        style={{ color: hasProducts ? "#f0f0f0" : "#888" }}
                      >
                        {tier.label}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-foreground-muted/50">
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
                            {tierProducts.length} dispo
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
        <button
          onClick={() => setShowOrder(true)}
          className="relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl py-4 text-base font-extrabold tracking-wide text-white transition-all duration-200 hover:brightness-110 active:scale-[0.97]"
          style={{
            background: "linear-gradient(135deg, #a855f7, #7c3aed)",
            boxShadow: "0 0 28px rgba(168,85,247,0.45), 0 4px 16px rgba(0,0,0,0.3)",
          }}
        >
          <span className="text-xl leading-none">📥</span>
          PRISE DE COMMANDE
        </button>
      </motion.div>

      {/* ── Order popup ── */}
      <AnimatePresence>
        {showOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-md"
              onClick={() => setShowOrder(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-sm -translate-y-1/2 rounded-3xl bg-surface p-6"
              style={{
                boxShadow:
                  "0 0 0 1px rgba(168,85,247,0.2), 0 24px 64px rgba(0,0,0,0.6), 0 0 40px rgba(168,85,247,0.15)",
              }}
            >
              <button
                onClick={() => setShowOrder(false)}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-surface-raised text-foreground-muted transition-colors hover:text-foreground"
              >
                <X size={16} />
              </button>

              <div className="space-y-5 text-center">
                <div className="space-y-1.5 pt-1">
                  <h2 className="font-display text-2xl font-extrabold tracking-tight gradient-text">
                    Passe ta commande
                  </h2>
                  <p className="text-xs text-foreground-muted">
                    Envoie-nous le produit et le parfum souhaités
                  </p>
                </div>

                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-sm font-bold text-white transition-all hover:brightness-110 active:scale-[0.97]"
                  style={{ background: "#25D366", boxShadow: "0 0 20px rgba(37,211,102,0.35)" }}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white shrink-0" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>

                <a
                  href={`sms:+33${PHONE.replace(/\s/g, "").slice(1)}`}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold text-foreground-muted transition-all hover:text-foreground"
                  style={{ border: "1px solid rgba(168,85,247,0.12)" }}
                >
                  <MessageCircle size={15} strokeWidth={2} />
                  SMS — {PHONE}
                </a>

                <button
                  onClick={handleCopy}
                  className="flex w-full items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold text-foreground-muted/60 transition-all hover:text-foreground-muted"
                >
                  {copied ? <Check size={13} className="text-accent" /> : <Copy size={13} />}
                  {copied ? "Numéro copié !" : "Copier le numéro"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
