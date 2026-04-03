"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { readCheckoutDraft, writeCheckoutDraft } from "@/lib/checkout-draft";
import type { CheckoutFormValues, ContactMethod } from "@/types/checkout";

const SAVE_DEBOUNCE_MS = 450;

/**
 * Hydrate depuis localStorage ; sauvegarde le brouillon (debounce).
 * `orderNoteFromCart` : valeur au premier montage (synchronise le panier).
 */
export function useCheckoutFormPersist(
  orderNoteFromCart: string,
  syncCartNote: (note: string) => void
): {
  form: CheckoutFormValues;
  update: <K extends keyof CheckoutFormValues>(field: K, value: CheckoutFormValues[K]) => void;
  hydrated: boolean;
} {
  const [form, setForm] = useState<CheckoutFormValues>(() => ({
    address: "",
    note: orderNoteFromCart,
    preferredContactMethod: "whatsapp"
  }));
  const [hydrated, setHydrated] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialNoteRef = useRef(orderNoteFromCart);

  useEffect(() => {
    const draft = readCheckoutDraft();

    setForm((prev) => ({
      address: draft?.address ?? prev.address,
      note: draft?.note !== undefined ? draft.note : prev.note || initialNoteRef.current,
      preferredContactMethod:
        (draft?.preferredContactMethod as ContactMethod | undefined) ?? prev.preferredContactMethod,
    }));
    setHydrated(true);
  }, []);

  /** Ne jamais appeler syncCartNote dans un updater setForm — ça met à jour CartProvider pendant le rendu enfant. */
  useEffect(() => {
    if (!hydrated) return;
    syncCartNote(form.note ?? "");
  }, [hydrated, form.note, syncCartNote]);

  const update = useCallback(<K extends keyof CheckoutFormValues>(field: K, value: CheckoutFormValues[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      writeCheckoutDraft({
        address: form.address,
        note: form.note ?? "",
        preferredContactMethod: form.preferredContactMethod,
      });
    }, SAVE_DEBOUNCE_MS);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [form, hydrated]);

  return { form, update, hydrated };
}
