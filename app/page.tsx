"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, X, MessageCircle } from "lucide-react";
import { useState } from "react";

import { ProductCardCompact } from "@/components/product/product-card-compact";
import { ProductsLoadGate } from "@/components/product/products-load-gate";
import { useProducts } from "@/hooks/useProducts";
import { BRAND } from "@/lib/constants";

const PHONE = "07 47 34 64 19";
const WHATSAPP_URL = "https://wa.me/message/6S23V2YKFYE4E1";

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
        <div className="grid grid-cols-2 gap-3">
          {products.map((product, i) => (
            <ProductCardCompact
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
                    Envoie-nous le produit et le parfum souhaités
                  </p>
                </div>

                {/* WhatsApp CTA — primary */}
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-sm font-bold text-white shadow-neon transition-all hover:shadow-neon-lg active:scale-[0.97]"
                  style={{ background: "#25D366", boxShadow: "0 0 20px rgba(37,211,102,0.35)" }}
                >
                  {/* WhatsApp SVG logo */}
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white shrink-0" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>

                {/* SMS — secondary */}
                <a
                  href={`sms:+33${PHONE.replace(/\s/g, "").slice(1)}`}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold text-foreground-muted transition-all hover:text-foreground"
                  style={{ border: "1px solid rgba(168,85,247,0.12)" }}
                >
                  <MessageCircle size={15} strokeWidth={2} />
                  Envoyer un SMS — {PHONE}
                </a>

                {/* Copy number */}
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
    </motion.div>
  );
}
