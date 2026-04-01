"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { readCheckoutDraft, writeCheckoutDraft } from "@/lib/checkout-draft";
import type { CheckoutFormValues, ContactMethod } from "@/types/checkout";

const SAVE_DEBOUNCE_MS = 450;

/**
 * Hydrate depuis localStorage + prénom Telegram ; sauvegarde le brouillon (debounce).
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
    firstName: "",
    phone: "",
    address: "",
    note: orderNoteFromCart,
    preferredContactMethod: "whatsapp"
  }));
  const [hydrated, setHydrated] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialNoteRef = useRef(orderNoteFromCart);

  useEffect(() => {
    const draft = readCheckoutDraft();

    setForm((prev) => {
      const merged: CheckoutFormValues = {
        firstName:
          draft?.firstName !== undefined && String(draft.firstName).length > 0
            ? draft.firstName
            : prev.firstName,
        phone: draft?.phone ?? prev.phone,
        address: draft?.address ?? prev.address,
        note:
          draft?.note !== undefined
            ? draft.note
            : prev.note || initialNoteRef.current,
        preferredContactMethod:
          (draft?.preferredContactMethod as ContactMethod | undefined) ?? prev.preferredContactMethod
      };
      return merged;
    });
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
        firstName: form.firstName,
        phone: form.phone,
        address: form.address,
        note: form.note ?? "",
        preferredContactMethod: form.preferredContactMethod
      });
    }, SAVE_DEBOUNCE_MS);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [form, hydrated]);

  return { form, update, hydrated };
}
