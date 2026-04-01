import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "./globals.css";

import { AppHeader } from "@/components/layout/app-header";
import { MainShell } from "@/components/layout/main-shell";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { CartProvider } from "@/hooks/useCart";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${BRAND.shortName} — ${BRAND.tagline}`,
  description: "PuffNcy — Ton cloud, ton style. Catalogue de puffs et e-liquides."
};

export const viewport: Viewport = {
  themeColor: "#08060f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

export default function RootLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <body className="min-h-dvh bg-background font-sans text-foreground" suppressHydrationWarning>
        {/* Animated background layers */}
        <div className="bg-grid" aria-hidden="true" />
        <div className="bg-blob-2" aria-hidden="true" />
        <div className="bg-blob-3" aria-hidden="true" />
        <div className="bg-scanline" aria-hidden="true" />

        <CartProvider>
          <AppHeader />
          <MainShell>{children}</MainShell>
          <BottomNav />
        </CartProvider>
      </body>
    </html>
  );
}
