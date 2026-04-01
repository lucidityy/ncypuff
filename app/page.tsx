"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Truck, MessageCircleMore, Eye, ArrowRight, Sparkles } from "lucide-react";

import { ProductGrid } from "@/components/product/product-grid";
import { ProductsLoadGate } from "@/components/product/products-load-gate";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";
import { BRAND } from "@/lib/constants";

const TRUST = [
  { label: "Qualité garantie", icon: ShieldCheck },
  { label: "Livraison rapide", icon: Truck },
  { label: "Support réactif", icon: MessageCircleMore },
  { label: "100% sécurisé", icon: Eye }
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

export default function HomePage(): JSX.Element {
  const { products, loading, error, reload } = useProducts();
  const featured = products.filter((p) => p.featured).slice(0, 4);

  return (
    <motion.div className="space-y-10" variants={stagger} initial="hidden" animate="show">
      {/* Hero — full-bleed immersive */}
      <motion.section variants={fadeUp} className="-mx-4 -mt-2">
        <div className="relative overflow-hidden">
          <Image
            src={BRAND.banner}
            alt={BRAND.fullName}
            width={800}
            height={500}
            className="aspect-[4/5] w-full object-cover sm:aspect-[16/10]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-transparent" />

          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 px-5 pb-6 sm:px-6">
            <div className="space-y-1.5">
              <p className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-2xs font-bold uppercase tracking-widest text-accent neon-border backdrop-blur-sm">
                <Sparkles size={12} strokeWidth={2.5} aria-hidden="true" />
                {BRAND.since}
              </p>
              <h1 className="font-display text-3xl leading-none tracking-wide sm:text-4xl">
                <span className="text-accent neon-text">{BRAND.fullName.toUpperCase()}</span>
              </h1>
              <p className="max-w-[260px] text-sm font-semibold leading-snug text-foreground/75">
                {BRAND.tagline}
              </p>
            </div>

            <div className="flex gap-2.5">
              <Button asChild className="shadow-neon">
                <Link href="/catalog">
                  Voir le catalogue
                  <ArrowRight size={14} className="ml-1.5" aria-hidden="true" />
                </Link>
              </Button>
              <Button variant="outline" asChild className="backdrop-blur-sm">
                <Link href="/offers">Promos</Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Trust — icon-driven, no emojis */}
      <motion.section variants={fadeUp} className="px-1">
        <div className="grid grid-cols-2 gap-2.5">
          {TRUST.map((item) => (
            <div
              key={item.label}
              className="group flex items-center gap-3 rounded-2xl border border-accent/10 bg-gradient-to-br from-surface to-surface-raised/60 px-3.5 py-3.5 transition-all duration-300 hover:border-accent/30 hover:shadow-glow"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/10 transition-colors duration-300 group-hover:bg-accent/20">
                <item.icon size={18} className="text-accent" strokeWidth={1.8} aria-hidden="true" />
              </div>
              <span className="text-xs font-bold leading-tight text-foreground/85">{item.label}</span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Featured */}
      <motion.section variants={fadeUp}>
        <SectionTitle title="Produits vedettes" subtitle="Nos meilleures ventes" />
        <ProductsLoadGate loading={loading} error={error} onRetry={reload}>
          <ProductGrid products={featured} />
        </ProductsLoadGate>
      </motion.section>
    </motion.div>
  );
}
