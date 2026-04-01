"use client";

import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type ProductsLoadGateProps = {
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  children: ReactNode;
};

/** Centralise état chargement / erreur pour les vues basées sur `useProducts`. */
export function ProductsLoadGate({
  loading,
  error,
  onRetry,
  children
}: ProductsLoadGateProps): JSX.Element {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-foreground-muted">
        <Loader2 className="h-8 w-8 animate-spin text-accent" aria-hidden />
        <p className="text-sm font-semibold">Chargement du catalogue…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 rounded-2xl bg-surface p-6 text-center neon-border">
        <p className="text-sm font-semibold text-red-400">{error}</p>
        <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => void onRetry()}>
          Réessayer
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
