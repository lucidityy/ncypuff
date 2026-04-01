"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Phone, Copy, Check, X, MessageCircle } from "lucide-react";
import { useState } from "react";

import { ProductCard } from "@/components/product/product-card";
import { ProductsLoadGate } from "@/components/product/products-load-gate";
import { useProducts } from "@/hooks/useProducts";
import { BRAND } from "@/lib/constants";

const PHONE = "07 47 34 64 19";
const PHONE_TEL = "tel:+33747346419";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

export default function HomePage(): JSX.Element {
  const { products, loading, error, reload } = useProducts();
  const [showOrder, setShowOrder] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PHONE.replace(/\s/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  };

  return (
    <motion.div className="space-y-6" variants={stagger} initial="hidden" animate="show">

      {/* Hero */}
      <motion.div variants={fadeUp} className="flex flex-col items-center gap-3 pt-4 pb-1 text-center">
        <div className="relative">
          <div className="absolute -inset-8 rounded-full bg-accent/10 blur-3xl" />
          <Image
            src={BRAND.logo}
            alt={BRAND.fullName}
            width={160}
            height={160}
            className="relative animate-float drop-shadow-[0_0_32px_rgba(168,85,247,0.35)]"
            priority
          />
        </div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight leading-none">
          <span className="gradient-text">NOS PUFFS 💨</span>
        </h1>
      </motion.div>

      {/* Products */}
      <ProductsLoadGate loading={loading} error={error} onRetry={reload}>
        <div className="space-y-5">
          {products.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              onOrder={() => setShowOrder(true)}
            />
          ))}
        </div>
      </ProductsLoadGate>


      {/* Order popup */}
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
              className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-sm -translate-y-1/2 rounded-3xl bg-surface p-6 shadow-neon-lg"
              style={{ boxShadow: "0 0 0 1px rgba(168,85,247,0.2), 0 24px 64px rgba(0,0,0,0.6), 0 0 40px rgba(168,85,247,0.15)" }}
            >
              <button
                onClick={() => setShowOrder(false)}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-surface-raised text-foreground-muted transition-colors hover:text-foreground"
              >
                <X size={16} />
              </button>

              <div className="space-y-5 text-center">
                {/* Header */}
                <div className="space-y-1.5 pt-1">
                  <h2 className="font-display text-2xl font-extrabold tracking-tight gradient-text">
                    Passe ta commande
                  </h2>
                  <p className="text-xs text-foreground-muted">
                    Envoie un message avec le produit et le parfum
                  </p>
                </div>

                {/* Phone display */}
                <div
                  className="flex items-center justify-center gap-3 rounded-2xl px-4 py-4"
                  style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)" }}
                >
                  <Phone size={18} className="shrink-0 text-accent" />
                  <span className="font-display text-2xl font-extrabold tracking-wide text-foreground">
                    {PHONE}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2.5">
                  <a
                    href={PHONE_TEL}
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-accent py-3.5 text-sm font-bold text-background shadow-neon transition-all hover:shadow-neon-lg active:scale-[0.97]"
                  >
                    <Phone size={15} strokeWidth={2.5} />
                    Appeler
                  </a>
                  <button
                    onClick={handleCopy}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-surface-raised px-4 py-3.5 text-sm font-bold text-foreground transition-all hover:bg-accent/10 active:scale-[0.97]"
                    style={{ border: "1px solid rgba(168,85,247,0.15)" }}
                  >
                    {copied ? <Check size={15} className="text-accent" /> : <Copy size={15} />}
                    {copied ? "Copié !" : "Copier"}
                  </button>
                </div>

                <a
                  href="sms:+33747346419"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold text-accent/80 transition-all hover:text-accent"
                  style={{ border: "1px solid rgba(168,85,247,0.12)" }}
                >
                  <MessageCircle size={15} strokeWidth={2} />
                  Envoyer un SMS
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
