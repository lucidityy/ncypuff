export type ProductTag =
  | "Premium"
  | "New"
  | "Popular"
  | "Best Seller"
  | "Limited"
  | "Sale"
  | "Exclusive"
  | "Starter";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  price: number;
  image: string;
  stock: number;
  featured: boolean;
  format: string;
  tags: ProductTag[];
}
