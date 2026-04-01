export interface Offer {
  id: string;
  title: string;
  description: string;
  discountLabel: string;
  code?: string;
  highlighted?: boolean;
}

/** Offres affichées sur /offers quand tu en ajoutes. */
export const OFFERS: Offer[] = [];
