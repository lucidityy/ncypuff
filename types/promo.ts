export type PromoKind = "percent" | "fixed" | "sample";

export interface PromoCodeRecord {
  id: string;
  /** Code saisi par le client (normalisé en majuscules côté serveur) */
  code: string;
  kind: PromoKind;
  /** %, € au panier, ou grammes offerts (kind sample) */
  value: number;
  label: string;
  active: boolean;
  /** Produit ciblé si kind === "sample" (prix €/g × grammes = réduction plafonnée au sous-total) */
  productId?: string;
}
