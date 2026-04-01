"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { BRAND } from "@/lib/constants";

export function AppHeader(): JSX.Element {
  return (
    <motion.header
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-30 glass border-b border-accent/10"
    >
      <div className="mx-auto flex w-full max-w-md items-center justify-between px-4 py-1.5">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src={BRAND.logo}
            alt={BRAND.fullName}
            width={36}
            height={36}
            className="rounded-full shadow-neon"
          />
          <div className="flex flex-col">
            <span className="font-display text-lg leading-none tracking-wide text-accent neon-text">
              {BRAND.shortName}
            </span>
            <span className="text-2xs font-semibold text-foreground-muted">
              {BRAND.fullName}
            </span>
          </div>
        </Link>
        <span className="rounded-full bg-accent/15 px-2.5 py-1 text-2xs font-bold text-accent neon-border">
          {BRAND.since}
        </span>
      </div>
    </motion.header>
  );
}
