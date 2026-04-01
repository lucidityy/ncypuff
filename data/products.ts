import type { Product } from "@/types/product";

export const PRODUCTS: Product[] = [
  {
    id: "p-1",
    slug: "ehose-x-60k",
    name: "E-HOSE X 60K",
    subtitle: "AL FAKHER • Crown Bar",
    category: "Puffs",
    shortDescription: "Hookah. Evolved. 60 000 puffs rechargeable.",
    longDescription:
      "Le monstre. 60 000 puffs, design hookah premium, batterie longue durée rechargeable USB-C. Saveurs intenses et vapeur ultra-dense. Le top du top.",
    price: 25,
    prices: [
      { qty: 1, price: 25 },
      { qty: 2, price: 40 }
    ],
    puffs: "60 000",
    flavors: [
      "Fruit rouge myrtille",
      "Lush ice",
      "Fraise punch",
      "Gum mint",
      "Space dream (myrtille orange)"
    ],
    image: "/brand/ehose-60k.jpg",
    stock: 80,
    featured: true,
    format: "60K puffs",
    tags: ["Best Seller", "Popular"]
  },
  {
    id: "p-2",
    slug: "megamax-40k",
    name: "MEGAMAX 40K",
    subtitle: "AL FAKHER • Crown Bar",
    category: "Puffs",
    shortDescription: "More clouds. More moments. 40 000 puffs v2.0.",
    longDescription:
      "Beyond Max. Format compact, 40 000 puffs, v2.0. Le rapport qualité/prix imbattable. USB-C, design ergonomique, LED intégrée.",
    price: 20,
    prices: [
      { qty: 1, price: 20 },
      { qty: 3, price: 50 }
    ],
    puffs: "40 000",
    flavors: [
      "Raisin fruit rouge",
      "Cerise",
      "Myrtille menthe",
      "Myrtille cerise",
      "Fruit rouge"
    ],
    image: "/brand/megamax-40k.jpg",
    stock: 100,
    featured: true,
    format: "40K puffs",
    tags: ["Popular", "Best Seller"]
  },
  {
    id: "p-3",
    slug: "falcon-pro",
    name: "FALCON PRO",
    subtitle: "JNR • Just No Reason",
    category: "Puffs",
    shortDescription: "Visual Impact. Falcon Series Stronger.",
    longDescription:
      "Le Falcon Pro par JNR. Design eagle premium, écran LED, batterie rechargeable. Vapeur puissante, look unique.",
    price: 22,
    prices: [
      { qty: 1, price: 22 },
      { qty: 2, price: 38 }
    ],
    puffs: "25 000",
    flavors: [
      "Watermelon ice",
      "Blue razz",
      "Grape ice",
      "Mango ice",
      "Strawberry banana"
    ],
    image: "/brand/banner.jpg",
    stock: 60,
    featured: true,
    format: "25K puffs",
    tags: ["New", "Premium"]
  }
];

export const FEATURED_PRODUCTS = PRODUCTS.filter((product) => product.featured);
