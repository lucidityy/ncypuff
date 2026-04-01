"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Phone, MessageCircle, Copy, Check } from "lucide-react";
import { useState } from "react";

import { BRAND } from "@/lib/constants";

const PHONE = "07 47 34 64 19";
const PHONE_TEL = "tel:+33747346419";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } }
};

export default function CommanderPage(): JSX.Element {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PHONE.replace(/\s/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard not available */
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center gap-8 pt-8 pb-4 text-center"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={fadeUp} className="relative">
        <div className="absolute -inset-6 rounded-full bg-accent/8 blur-3xl" />
        <Image
          src={BRAND.logo}
          alt={BRAND.fullName}
          width={120}
          height={120}
          className="relative drop-shadow-[0_0_24px_rgba(168,85,247,0.3)]"
        />
      </motion.div>

      <motion.div variants={fadeUp} className="space-y-2">
        <h1 className="font-display text-2xl font-extrabold tracking-tight">
          <span className="gradient-text">Passe ta commande</span>
        </h1>
        <p className="text-sm text-foreground-muted">
          Envoie un message avec le produit et le goût
        </p>
      </motion.div>

      {/* Phone number card */}
      <motion.div
        variants={fadeUp}
        className="w-full max-w-xs space-y-4"
      >
        <div className="rounded-3xl bg-surface p-6 neon-border space-y-5">
          <div className="flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15">
              <Phone size={22} className="text-accent" strokeWidth={2} />
            </div>
            <span className="font-display text-2xl font-extrabold tracking-wide text-foreground">
              {PHONE}
            </span>
          </div>

          <div className="flex gap-2">
            <a
              href={PHONE_TEL}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-accent py-3.5 text-sm font-bold text-background shadow-neon transition-all duration-200 hover:shadow-neon-lg hover:brightness-110 active:scale-95"
            >
              <Phone size={16} strokeWidth={2.5} />
              Appeler
            </a>
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 rounded-2xl bg-surface-raised px-4 py-3.5 text-sm font-bold text-foreground neon-border transition-all duration-200 hover:bg-accent/15 active:scale-95"
            >
              {copied ? <Check size={16} className="text-accent" /> : <Copy size={16} />}
              {copied ? "Copié" : "Copier"}
            </button>
          </div>
        </div>

        <a
          href={`sms:+33747346419`}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-accent/10 py-3.5 text-sm font-bold text-accent neon-border transition-all duration-200 hover:bg-accent/20 active:scale-95"
        >
          <MessageCircle size={16} strokeWidth={2.5} />
          Envoyer un SMS
        </a>
      </motion.div>

      <motion.p variants={fadeUp} className="max-w-[260px] text-xs text-foreground-muted/60">
        Précise le produit, le parfum et la quantité souhaitée. On te répond rapidement.
      </motion.p>
    </motion.div>
  );
}
