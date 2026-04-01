import { z } from "zod";

export const changeAdminPasswordSchema = z.object({
  currentPassword: z.string().min(1, "Mot de passe actuel requis"),
  newPassword: z.string().min(8, "Au moins 8 caractères").max(200)
});

export type ChangeAdminPasswordInput = z.infer<typeof changeAdminPasswordSchema>;
