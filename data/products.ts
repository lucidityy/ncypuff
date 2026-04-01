import type { Product } from "@/types/product";

export const PRODUCTS: Product[] = [
  {
    id: "p-1",
    slug: "classic-tee-black",
    name: "Classic Tee — Black",
    category: "Clothing",
    shortDescription: "Essential everyday t-shirt in premium cotton.",
    longDescription:
      "A wardrobe staple crafted from 100% organic cotton. Pre-shrunk, comfortable fit with reinforced seams.",
    price: 29.9,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    stock: 50,
    featured: true,
    format: "M",
    tags: ["Best Seller", "New"]
  },
  {
    id: "p-2",
    slug: "leather-wallet",
    name: "Leather Wallet",
    category: "Accessories",
    shortDescription: "Handcrafted slim wallet in full-grain leather.",
    longDescription:
      "Minimalist bifold wallet with 6 card slots and a bill compartment. Ages beautifully with use.",
    price: 49.0,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1200&q=80",
    stock: 25,
    featured: true,
    format: "",
    tags: ["Premium", "Limited"]
  },
  {
    id: "p-3",
    slug: "canvas-tote",
    name: "Canvas Tote Bag",
    category: "Bags",
    shortDescription: "Durable everyday tote in waxed canvas.",
    longDescription:
      "Heavy-duty 16oz waxed canvas tote with leather handles. Water-resistant and built to last.",
    price: 39.0,
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80",
    stock: 40,
    featured: true,
    format: "",
    tags: ["Popular"]
  },
  {
    id: "p-4",
    slug: "stainless-water-bottle",
    name: "Stainless Water Bottle",
    category: "Lifestyle",
    shortDescription: "Double-wall insulated bottle, 500ml.",
    longDescription:
      "Keeps drinks cold for 24h or hot for 12h. BPA-free, leak-proof cap. Matte finish.",
    price: 24.9,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1200&q=80",
    stock: 60,
    featured: false,
    format: "500ml",
    tags: ["New"]
  }
];

export const FEATURED_PRODUCTS = PRODUCTS.filter((product) => product.featured);
