import { z } from "zod/v4";

export const productCreateSchema = z.object({
  name: z.string().min(1, "Nom requis").max(120),
  category: z.string().min(1, "Catégorie requise").max(60),
  shortDescription: z.string().min(1, "Description courte requise").max(300),
  longDescription: z.string().max(2000).default(""),
  price: z.number().min(0, "Prix invalide"),
  image: z.string().url("URL image invalide").or(z.literal("")),
  stock: z.number().int().min(0, "Stock invalide"),
  featured: z.boolean().default(false),
  format: z.string().max(60).default(""),
  tags: z.array(z.string()).default([])
});

export const productUpdateSchema = productCreateSchema.partial();

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
