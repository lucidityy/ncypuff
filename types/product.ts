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
  stock: number;
  featured: boolean;
  format: string;
  tags: ProductTag[];
}
