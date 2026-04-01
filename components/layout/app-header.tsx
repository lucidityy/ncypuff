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
      <div className="mx-auto flex w-full max-w-md items-center justify-center px-4 py-3">
        <Link href="/">
          <Image
            src={BRAND.logo}
            alt={BRAND.fullName}
            width={72}
            height={72}
            className="drop-shadow-[0_0_16px_rgba(168,85,247,0.4)]"
          />
        </Link>
      </div>
    </motion.header>
  );
}
