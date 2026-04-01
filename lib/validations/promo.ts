import { z } from "zod";

import type { PromoKind } from "@/types/promo";

const kindSchema = z.enum(["percent", "fixed", "sample"] satisfies [PromoKind, PromoKind, PromoKind]);

export const promoCodeRecordSchema = z
  .object({
    id: z.string().min(1).max(80),
    code: z.string().min(1).max(40).transform((s) => s.trim().toUpperCase()),
    kind: kindSchema,
    value: z.number().positive(),
    label: z.string().min(1).max(120),
    active: z.boolean(),
    productId: z.string().max(120).optional()
  })
  .superRefine((data, ctx) => {
    if (data.kind === "percent" && data.value > 100) {
      ctx.addIssue({ code: "custom", message: "Le pourcentage ne peut pas dépasser 100", path: ["value"] });
    }
    if (data.kind === "sample") {
      if (!data.productId?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Choisis un produit pour l’échantillon",
          path: ["productId"]
        });
      }
      if (data.value > 500) {
        ctx.addIssue({ code: "custom", message: "Maximum 500 g pour un échantillon", path: ["value"] });
      }
    }
  })
  .transform((data) => ({
    ...data,
    productId: data.kind === "sample" ? data.productId?.trim() : undefined
  }));

export const promoCodesPayloadSchema = z.object({
  promoCodes: z.array(promoCodeRecordSchema).max(200)
});

export type PromoCodesPayload = z.infer<typeof promoCodesPayloadSchema>;
