import { z } from "zod";

const priceTierSchema = z.object({
  qty: z.number().int().min(1),
  price: z.number().min(0)
});

export const productCreateSchema = z.object({
  name: z.string().min(1, "Nom requis").max(120),
  subtitle: z.string().max(120).default(""),
  category: z.string().min(1, "Catégorie requise").max(60),
  shortDescription: z.string().min(1, "Description courte requise").max(300),
  longDescription: z.string().max(2000).default(""),
  price: z.number().min(0, "Prix invalide"),
  prices: z.array(priceTierSchema).default([]),
  puffs: z.string().max(60).default(""),
  flavors: z.array(z.string()).default([]),
  image: z.string().refine((v) => v === "" || /^https?:\/\/.+/i.test(v) || /^\/\S+/.test(v), "URL image invalide").default(""),
  imagePosition: z.string().max(10).default("50%"),
  featured: z.boolean().default(false),
  format: z.string().max(60).default(""),
  tags: z.array(z.string()).default([])
});

export const productUpdateSchema = productCreateSchema.partial();

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
