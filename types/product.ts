export type ProductTag =
  | "Premium"
  | "New"
  | "Popular"
  | "Best Seller"
  | "Limited"
  | "Sale"
  | "Exclusive"
  | "Starter";

export interface PriceTier {
  qty: number;
  price: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  price: number;
  prices: PriceTier[];
  puffs: string;
  flavors: string[];
  image: string;
  /** Vertical focal point for object-cover images. "0%" = top, "50%" = center, "100%" = bottom */
  imagePosition?: string;
  featured: boolean;
  format: string;
  tags: ProductTag[];
}
