"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MessageCircle, Copy, Check } from "lucide-react";
import { useState } from "react";

import { BRAND, CONTACT } from "@/lib/constants";

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
      await navigator.clipboard.writeText(CONTACT.phone.replace(/\s/g, ""));
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
              <MessageCircle size={22} className="text-accent" strokeWidth={2} />
            </div>
            <span className="font-display text-2xl font-extrabold tracking-wide text-foreground">
              {CONTACT.phone}
            </span>
          </div>

          {/* WhatsApp — primary */}
          <a
            href={CONTACT.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-white transition-all duration-200 hover:brightness-110 active:scale-95"
            style={{ background: "#25D366", boxShadow: "0 0 16px rgba(37,211,102,0.3)" }}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white shrink-0" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>
        </div>

        {/* SMS + Copy — secondary row */}
        <div className="flex gap-2">
          <a
            href={CONTACT.smsUrl}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-accent/10 py-3 text-sm font-semibold text-accent neon-border transition-all duration-200 hover:bg-accent/20 active:scale-95"
          >
            <MessageCircle size={15} strokeWidth={2.5} />
            SMS
          </a>
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 rounded-2xl bg-surface-raised px-4 py-3 text-sm font-semibold text-foreground-muted neon-border transition-all duration-200 hover:bg-accent/15 active:scale-95"
          >
            {copied ? <Check size={15} className="text-accent" /> : <Copy size={15} />}
            {copied ? "Copié" : "Copier"}
          </button>
        </div>
      </motion.div>

      <motion.p variants={fadeUp} className="max-w-[260px] text-xs text-foreground-muted/60">
        Précise le produit, le parfum et la quantité souhaitée. On te répond rapidement.
      </motion.p>
    </motion.div>
  );
}
