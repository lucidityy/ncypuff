import { formatQuantity } from "@/lib/format";
import type { PromoCodeRecord } from "@/types/promo";
import type { Product } from "@/types/product";

export type PromoApplyResult =
  | {
      ok: true;
      code: string;
      discountAmount: number;
      totalAfter: number;
      label: string;
      /** Détail pour récap / message (échantillon) */
      sampleLine?: string;
    }
  | { ok: false; error: string };

function roundMoney(n: number): number {
  return Math.round(n * 100) / 100;
}

export type PromoProductSlice = Pick<Product, "id" | "price" | "name" | "stock">;

/**
 * Applique un code promo à partir de la liste persistée (codes actifs uniquement).
 * `products` sert à résoudre le prix au gramme pour les échantillons.
 */
export function applyPromoCode(
  subtotal: number,
  rawInput: string,
  records: PromoCodeRecord[],
  products: PromoProductSlice[]
): PromoApplyResult {
  const key = rawInput.trim().toUpperCase();
  if (!key) {
    return { ok: false, error: "Saisis un code." };
  }

  const def = records.find((r) => r.active && r.code.trim().toUpperCase() === key);
  if (!def) {
    return { ok: false, error: "Code invalide ou expiré." };
  }
  if (subtotal <= 0) {
    return { ok: false, error: "Panier vide." };
  }

  const byId = new Map(products.map((p) => [p.id, p]));

  let discount = 0;
  let sampleLine: string | undefined;

  if (def.kind === "sample") {
    const pid = def.productId?.trim();
    if (!pid) {
      return { ok: false, error: "Code promo mal configuré." };
    }
    const p = byId.get(pid);
    if (!p) {
      return { ok: false, error: "Produit offert indisponible." };
    }
    if (p.stock < def.value) {
      return { ok: false, error: "Stock insuffisant pour cet échantillon." };
    }
    const unitValue = roundMoney(p.price * def.value);
    discount = roundMoney(Math.min(unitValue, subtotal));
    sampleLine = `Échantillon : ${formatQuantity(def.value)} · ${p.name}`;
  } else if (def.kind === "percent") {
    discount = roundMoney((subtotal * def.value) / 100);
  } else {
    discount = roundMoney(Math.min(def.value, subtotal));
  }

  const totalAfter = roundMoney(Math.max(0, subtotal - discount));

  return {
    ok: true,
    code: key,
    discountAmount: discount,
    totalAfter,
    label: def.label,
    ...(sampleLine ? { sampleLine } : {})
  };
}
