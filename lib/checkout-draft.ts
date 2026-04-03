import type { ContactMethod } from "@/types/checkout";

const STORAGE_KEY = "mini-app-checkout-draft";

export interface CheckoutDraftPayload {
  address: string;
  note: string;
  preferredContactMethod: ContactMethod;
}

const VALID_METHODS = new Set<string>(["whatsapp", "signal", "snapchat"]);

export function readCheckoutDraft(): Partial<CheckoutDraftPayload> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    const obj = parsed as Record<string, unknown>;

    const draft: Partial<CheckoutDraftPayload> = {};
    if (typeof obj.address === "string") draft.address = obj.address;
    if (typeof obj.note === "string") draft.note = obj.note;
    if (typeof obj.preferredContactMethod === "string" && VALID_METHODS.has(obj.preferredContactMethod)) {
      draft.preferredContactMethod = obj.preferredContactMethod as ContactMethod;
    }

    return Object.keys(draft).length > 0 ? draft : null;
  } catch {
    return null;
  }
}

export function writeCheckoutDraft(payload: CheckoutDraftPayload): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // quota / private mode
  }
}
