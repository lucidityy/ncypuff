import { formatQuantity, formatPrice } from "@/lib/format";
import { DELIVERY_LABEL } from "@/lib/constants";
import type { CartItem } from "@/types/cart";

export interface CheckoutPromoLine {
  code: string;
  discountAmount: number;
  total: number;
  sampleLine?: string;
}

interface OrderSummaryCardProps {
  items: CartItem[];
  address: string;
  note?: string;
  promo?: CheckoutPromoLine | null;
}

function computeSubtotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
}

export function buildOrderSummaryText(params: OrderSummaryCardProps): string {
  const subtotal = computeSubtotal(params.items);
  const total = params.promo?.total ?? subtotal;

  const lines = [
    "🛒 Order",
    "",
    ...params.items.map(
      (i) =>
        `- ${i.product.name} × ${formatQuantity(i.quantity)} = ${formatPrice(i.product.price * i.quantity)}`
    ),
    "",
    `📦 ${DELIVERY_LABEL}`,
    `📍 Adresse: ${params.address || "Non fournie"}`
  ];

  if (params.note?.trim()) {
    lines.push(`📝 Note: ${params.note.trim()}`);
  }

  if (params.promo) {
    lines.push(
      `🎟️ Promo ${params.promo.code}: ${formatPrice(-params.promo.discountAmount)}`
    );
    if (params.promo.sampleLine?.trim()) {
      lines.push(`   ${params.promo.sampleLine.trim()}`);
    }
  }

  lines.push(`\n💰 Total: ${formatPrice(total)}`);
  return lines.join("\n");
}

export function OrderSummaryCard({ items, address, note, promo }: OrderSummaryCardProps): JSX.Element {
  const subtotal = computeSubtotal(items);
  const total = promo?.total ?? subtotal;

  return (
    <div className="rounded-2xl bg-surface p-4 neon-border">
      <p className="font-display text-lg tracking-wide text-accent">Récapitulatif</p>
      <div className="mt-3 space-y-2.5 text-sm">
        {items.map((item) => (
          <div key={item.product.id} className="flex items-start justify-between gap-2">
            <span className="text-foreground-muted">
              {item.product.name}{" "}
              <span className="text-foreground-muted/50">×{formatQuantity(item.quantity)}</span>
            </span>
            <span className="font-bold text-foreground">
              {formatPrice(item.product.price * item.quantity)}
            </span>
          </div>
        ))}
        {promo && (
          <div className="space-y-1 border-t border-accent/10 pt-2 text-foreground-muted">
            <div className="flex items-center justify-between">
              <span>🎟️ Promo {promo.code}</span>
              <span className="font-semibold text-accent">−{formatPrice(promo.discountAmount)}</span>
            </div>
            {promo.sampleLine?.trim() ? (
              <p className="text-2xs text-foreground-muted/80">{promo.sampleLine.trim()}</p>
            ) : null}
          </div>
        )}
        <div className="space-y-1.5 border-t border-accent/10 pt-2.5">
          <div className="flex justify-between text-foreground-muted">
            <span>📦 Livraison</span>
            <span className="text-foreground">{DELIVERY_LABEL}</span>
          </div>
          <div className="flex justify-between text-foreground-muted">
            <span>📍 Adresse</span>
            <span className="text-foreground">{address || "—"}</span>
          </div>
        </div>
        {note?.trim() && (
          <p className="text-foreground-muted/60">📝 {note.trim()}</p>
        )}
        <div className="flex items-baseline justify-between border-t border-accent/10 pt-2.5">
          <span className="font-display text-base tracking-wide text-foreground">Total</span>
          <span className="font-display text-xl text-accent neon-text">{formatPrice(total)}</span>
        </div>
        {promo && (
          <p className="text-2xs text-foreground-muted/50">
            Sous-total {formatPrice(subtotal)} · réduction {formatPrice(promo.discountAmount)}
          </p>
        )}
      </div>
    </div>
  );
}
