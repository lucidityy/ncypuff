export interface PuffTier {
  id: string;
  /** Must match product.puffs exactly */
  puffsKey: string;
  label: string;
  emoji: string;
  brand: string;
}

export const PUFF_TIERS: PuffTier[] = [
  { id: "9k",   puffsKey: "9 000",  label: "9 000 TAFFS",  emoji: "👽", brand: "R&M" },
  { id: "16k",  puffsKey: "16 000", label: "16 000 TAFFS", emoji: "🦅", brand: "JNR" },
  { id: "18k",  puffsKey: "18 000", label: "18 000 TAFFS", emoji: "🦅", brand: "JNR" },
  { id: "20k",  puffsKey: "20 000", label: "20 000 TAFFS", emoji: "💨", brand: "ADALYA" },
  { id: "22k",  puffsKey: "22 000", label: "22 000 TAFFS", emoji: "💨", brand: "JNR" },
  { id: "28k",  puffsKey: "28 000", label: "28 000 TAFFS", emoji: "🦅", brand: "JNR" },
  { id: "40k",  puffsKey: "40 000", label: "40 000 TAFFS", emoji: "💨", brand: "AL FAKHER" },
  { id: "48k",  puffsKey: "48 000", label: "48 000 TAFFS", emoji: "🦅", brand: "JNR" },
  { id: "55k",  puffsKey: "55 000", label: "55 000 TAFFS", emoji: "🦍", brand: "JNR" },
  { id: "60k",  puffsKey: "60 000", label: "60 000 TAFFS", emoji: "💨", brand: "AL FAKHER" },
  { id: "snus", puffsKey: "SNUS",   label: "SNUS",         emoji: "🩹", brand: "PABLO" },
];
