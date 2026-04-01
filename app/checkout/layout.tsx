import type { ReactNode } from "react";

/** Force le rendu dynamique : évite erreurs webpack prerender sur la page client (context panier + hooks). */
export const dynamic = "force-dynamic";

export default function CheckoutLayout({ children }: { children: ReactNode }): ReactNode {
  return children;
}
