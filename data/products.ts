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

    featured: true,
    format: "40K puffs",
    tags: ["Popular", "Best Seller"]
  },
  {
    id: "p-4",
    slug: "rage-gorilla-55k",
    name: "RAGE GORILLA 55K",
    subtitle: "JNR • Just No Reason",
    category: "Puffs",
    shortDescription: "Gorilla Powers Up, Screen Sparks. 55 000 puffs.",
    longDescription:
      "Le Rage Gorilla par JNR. 55 000 puffs, 42ml e-liquid, Smart Screen, Dual Mesh Coil, USB-C, batterie 950 mAh. Nicotine 2%. Le plus costaud de la gamme.",
    price: 20,
    prices: [
      { qty: 1, price: 20 },
      { qty: 3, price: 50 }
    ],
    puffs: "55 000",
    flavors: [
      "Cherry cola",
      "Myrtille framboise",
      "Juicy pêche",
      "White pêche razz"
    ],
    image: "/brand/ragejnr.jpg",

    featured: true,
    format: "55K puffs",
    tags: ["New", "Popular"]
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
    puffs: "28 000",
    flavors: [
      "Watermelon ice",
      "Blue razz",
      "Grape ice",
      "Mango ice",
      "Strawberry banana"
    ],
    image: "/brand/banner.jpg",

    featured: true,
    format: "28K puffs",
    tags: ["New", "Premium"]
  },
  {
    id: "p-5",
    slug: "alien-9k",
    name: "ALIEN 9K",
    subtitle: "R&M • Monster Series",
    category: "Puffs",
    shortDescription: "Format mini, impact maximal. 9 000 puffs.",
    longDescription:
      "Le R&M Alien. Format ultra-compact, 9 000 puffs, bobine Mesh, saveurs intenses en toutes circonstances. Idéal pour une soirée ou un festival.",
    price: 10,
    prices: [
      { qty: 1, price: 10 },
      { qty: 3, price: 25 }
    ],
    puffs: "9 000",
    flavors: [
      "Fraise kiwi",
      "Menthe glaciale",
      "Pastèque ice",
      "Mangue ananas",
      "Raisin glacé"
    ],
    image: "/brand/banner.jpg",

    featured: false,
    format: "9K puffs",
    tags: ["Starter", "Popular"]
  },
  {
    id: "p-6",
    slug: "eagle-16k",
    name: "EAGLE 16K",
    subtitle: "JNR • Just No Reason",
    category: "Puffs",
    shortDescription: "Vole haut, tiens longtemps. 16 000 puffs.",
    longDescription:
      "Le JNR Eagle 16K. Design ailé iconique, 16 000 puffs, recharge USB-C, nicotine 2%. Saveurs riches, autonomie prolongée.",
    price: 14,
    prices: [
      { qty: 1, price: 14 },
      { qty: 3, price: 35 }
    ],
    puffs: "16 000",
    flavors: [
      "Blue razz lemon",
      "Cerise vanille",
      "Tropical punch",
      "Framboise menthe",
      "Peach ice"
    ],
    image: "/brand/banner.jpg",

    featured: false,
    format: "16K puffs",
    tags: ["New", "Popular"]
  },
  {
    id: "p-7",
    slug: "eagle-pro-18k",
    name: "EAGLE PRO 18K",
    subtitle: "JNR • Just No Reason",
    category: "Puffs",
    shortDescription: "Un cran au-dessus. 18 000 puffs, Smart Screen.",
    longDescription:
      "Le JNR Eagle Pro 18K. Écran LED intégré pour suivre ta batterie et ton e-liquid. 18 000 puffs, Mesh Coil, USB-C.",
    price: 16,
    prices: [
      { qty: 1, price: 16 },
      { qty: 2, price: 28 }
    ],
    puffs: "18 000",
    flavors: [
      "Watermelon bubblegum",
      "Strawberry mango",
      "Lychee ice",
      "Cola glace",
      "Kiwi passion"
    ],
    image: "/brand/banner.jpg",

    featured: false,
    format: "18K puffs",
    tags: ["New", "Premium"]
  },
  {
    id: "p-8",
    slug: "adalya-20k",
    name: "ADALYA 20K",
    subtitle: "ADALYA • Love Series",
    category: "Puffs",
    shortDescription: "Le goût du shisha en format puff. 20 000 puffs.",
    longDescription:
      "ADALYA Love 20K. Inspiré des tabacs à chicha ADALYA, ce format puff restitue les arômes signature de la marque. 20 000 puffs, rechargeable, nicotine 2%.",
    price: 18,
    prices: [
      { qty: 1, price: 18 },
      { qty: 3, price: 45 }
    ],
    puffs: "20 000",
    flavors: [
      "Love 66 (pêche fraise)",
      "Blueberry mint",
      "Mango tango",
      "Double apple",
      "Pink lemonade"
    ],
    image: "/brand/banner.jpg",

    featured: false,
    format: "20K puffs",
    tags: ["Popular", "Exclusive"]
  },
  {
    id: "p-9",
    slug: "jnr-22k",
    name: "JNR TITAN 22K",
    subtitle: "JNR • Just No Reason",
    category: "Puffs",
    shortDescription: "Puissance et endurance. 22 000 puffs.",
    longDescription:
      "Le JNR Titan 22K. Format intermédiaire idéal, 22 000 puffs, batterie 850 mAh, Dual Mesh Coil pour une vapeur dense et constante.",
    price: 18,
    prices: [
      { qty: 1, price: 18 },
      { qty: 3, price: 46 }
    ],
    puffs: "22 000",
    flavors: [
      "Cherry lemon",
      "Grape mint",
      "Fraise pastèque",
      "Sour apple ice",
      "Passion ice"
    ],
    image: "/brand/banner.jpg",

    featured: false,
    format: "22K puffs",
    tags: ["New", "Popular"]
  },
  {
    id: "p-10",
    slug: "eagle-max-48k",
    name: "EAGLE MAX 48K",
    subtitle: "JNR • Just No Reason",
    category: "Puffs",
    shortDescription: "L'Eagle au sommet. 48 000 puffs, design premium.",
    longDescription:
      "Le JNR Eagle Max 48K. Le plus grand format Eagle. 48 000 puffs, 38ml e-liquid, Smart Screen dual, Dual Mesh Coil, USB-C. L'autonomie totale.",
    price: 22,
    prices: [
      { qty: 1, price: 22 },
      { qty: 2, price: 40 }
    ],
    puffs: "48 000",
    flavors: [
      "Blue slush",
      "Mango peach ice",
      "Strawberry watermelon",
      "Pineapple coconut",
      "Berry blast"
    ],
    image: "/brand/banner.jpg",

    featured: false,
    format: "48K puffs",
    tags: ["Premium", "New"]
  },
  {
    id: "p-11",
    slug: "pablo-snus-extra",
    name: "PABLO EXTRA STRONG",
    subtitle: "PABLO • Nicotine Pouches",
    category: "Snus",
    shortDescription: "L'original sans fumée. Nicotine 30mg/g.",
    longDescription:
      "PABLO Extra Strong. Sachets de nicotine sans tabac, sans fumée, sans vapeur. 30mg/g de nicotine. À glisser sous la lèvre, discret et efficace. Saveurs premium importées.",
    price: 8,
    prices: [
      { qty: 1, price: 8 },
      { qty: 5, price: 35 }
    ],
    puffs: "SNUS",
    flavors: [
      "Ice cold mint",
      "Frosted mint",
      "Banana ice",
      "Watermelon",
      "Bubblegum"
    ],
    image: "/brand/banner.jpg",

    featured: false,
    format: "Nicotine Pouches",
    tags: ["Exclusive", "Popular"]
  }
];

export const FEATURED_PRODUCTS = PRODUCTS.filter((product) => product.featured);
