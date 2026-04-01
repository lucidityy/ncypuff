import Link from "next/link";
import { Percent } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { SectionTitle } from "@/components/shared/section-title";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatQuantity, formatPrice } from "@/lib/format";
import { getPromoCodes } from "@/lib/promo-repository";
import { getProducts } from "@/lib/products-repository";
import type { PromoCodeRecord } from "@/types/promo";
import type { Product } from "@/types/product";

function offerDetail(record: PromoCodeRecord, products: Product[]): string {
  if (record.kind === "percent") {
    return `${record.value} % de réduction sur le sous-total du panier.`;
  }
  if (record.kind === "fixed") {
    return `Jusqu’à ${formatPrice(record.value)} de réduction sur le sous-total.`;
  }
  const p = record.productId ? products.find((x) => x.id === record.productId) : undefined;
  if (!p) {
    return `${formatQuantity(record.value)} offerts (produit à confirmer au moment du checkout).`;
  }
  return `Échantillon ${formatQuantity(record.value)} · ${p.name} — appliqué comme réduction au checkout.`;
}

export default async function OffersPage(): Promise<JSX.Element> {
  const [records, products] = await Promise.all([getPromoCodes(), getProducts()]);
  const active = records.filter((r) => r.active && r.code.trim().length > 0);

  return (
    <div className="space-y-5 pt-4">
      <SectionTitle title="Promos" subtitle="Saisis un code promo au checkout." />

      {active.length === 0 ? (
        <EmptyState
          icon={Percent}
          title="Pas d’offre pour le moment"
          description="Pas d'offre pour le moment."
        />
      ) : (
        <>
          <div className="space-y-2.5">
            {active.map((row) => (
              <div key={row.id} className="rounded-2xl bg-surface p-4 neon-border">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="font-display text-base tracking-wide text-foreground">{row.label}</h3>
                  <Badge variant="outline" className="shrink-0 font-mono text-2xs uppercase">
                    {row.code}
                  </Badge>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-foreground-muted">{offerDetail(row, products)}</p>
              </div>
            ))}
          </div>
          <Button asChild className="w-full">
            <Link href="/checkout">Aller au checkout</Link>
          </Button>
        </>
      )}
    </div>
  );
}
