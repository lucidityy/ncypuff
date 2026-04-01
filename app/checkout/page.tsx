"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Truck, ShoppingBag } from "lucide-react";

import { CheckoutPromoSection } from "@/components/checkout/checkout-promo-section";
import { ContactMethodSelector } from "@/components/checkout/contact-method-selector";
import { OrderSummaryCard, buildOrderSummaryText } from "@/components/checkout/order-summary-card";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/hooks/useCart";
import { useCheckoutFormPersist } from "@/hooks/useCheckoutFormPersist";
import { CONTACT_LINKS, DELIVERY_LABEL } from "@/lib/constants";
import { fetchJson } from "@/lib/fetch-json";
import { formatPrice } from "@/lib/format";
import type { ContactMethod } from "@/types/checkout";

type AppliedPromo = {
  code: string;
  label: string;
  discountAmount: number;
  totalAfter: number;
  sampleLine?: string;
};

type PromoOkResponse = {
  ok: true;
  code: string;
  label: string;
  discountAmount: number;
  totalAfter: number;
  sampleLine?: string;
};

const CTA_LABELS: Record<ContactMethod, string> = {
  whatsapp: "WhatsApp — message prêt à envoyer",
  signal: "Signal — message copié, colle puis envoie",
  snapchat: "Snapchat — message copié, colle puis envoie"
};

const CTA_ORDER: ContactMethod[] = ["whatsapp", "signal", "snapchat"];

export default function CheckoutPage(): JSX.Element {
  const { items, subtotal, orderNote, setOrderNote } = useCart();
  const { form, update, hydrated } = useCheckoutFormPersist(orderNote, setOrderNote);

  const [copiedFor, setCopiedFor] = useState<ContactMethod | null>(null);
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [applyingPromo, setApplyingPromo] = useState(false);
  const [clipboardNotice, setClipboardNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!appliedPromo?.code) return;
    let cancelled = false;
    void (async () => {
      const result = await fetchJson<PromoOkResponse | { ok: false; error?: string }>("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: appliedPromo.code, subtotal })
      });
      if (cancelled) return;
      if (!result.ok) {
        setAppliedPromo(null);
        setPromoError(result.error);
        return;
      }
      const data = result.data;
      if (!data.ok) {
        setAppliedPromo(null);
        setPromoError(data.error ?? "Promo non applicable — panier modifié.");
        return;
      }
      setPromoError(null);
      setAppliedPromo({
        code: data.code,
        label: data.label,
        discountAmount: data.discountAmount,
        totalAfter: data.totalAfter,
        ...(data.sampleLine ? { sampleLine: data.sampleLine } : {})
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [subtotal, appliedPromo?.code]);

  const promoLine = useMemo(() => {
    if (!appliedPromo) return null;
    return {
      code: appliedPromo.code,
      discountAmount: appliedPromo.discountAmount,
      total: appliedPromo.totalAfter,
      ...(appliedPromo.sampleLine ? { sampleLine: appliedPromo.sampleLine } : {})
    };
  }, [appliedPromo]);

  const totalToPay = appliedPromo?.totalAfter ?? subtotal;

  const canFinalize = form.address.trim().length > 0;

  const summaryText = useMemo(
    () =>
      buildOrderSummaryText({
        items,
        address: form.address,
        note: form.note,
        promo: promoLine
      }),
    [form.address, form.note, items, promoLine]
  );

  const handleApplyPromo = useCallback(async () => {
    setPromoError(null);
    setApplyingPromo(true);
    const result = await fetchJson<PromoOkResponse | { ok: false; error?: string }>("/api/promo/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: promoInput.trim(), subtotal })
    });
    if (!result.ok) {
      setPromoError(result.error);
      setAppliedPromo(null);
      setApplyingPromo(false);
      return;
    }
    const data = result.data;
    if (!data.ok) {
      setPromoError(data.error ?? "Code invalide");
      setAppliedPromo(null);
      setApplyingPromo(false);
      return;
    }
    setAppliedPromo({
      code: data.code,
      label: data.label,
      discountAmount: data.discountAmount,
      totalAfter: data.totalAfter,
      ...(data.sampleLine ? { sampleLine: data.sampleLine } : {})
    });
    setPromoInput(data.code);
    setApplyingPromo(false);
  }, [promoInput, subtotal]);

  const handleRemovePromo = useCallback(() => {
    setAppliedPromo(null);
    setPromoError(null);
  }, []);

  const handlePromoInputChange = useCallback((value: string) => {
    setPromoInput(value);
    setPromoError(null);
  }, []);

  const customerBlock = useMemo(() => {
    const lines = [
      `📍 Adresse: ${form.address || "Non fournie"}`,
      "",
      summaryText
    ];
    return lines.filter(Boolean).join("\n");
  }, [form.address, summaryText]);

  const sortedMethods = useMemo(() => {
    const primary = form.preferredContactMethod;
    return [primary, ...CTA_ORDER.filter((m) => m !== primary)];
  }, [form.preferredContactMethod]);

  const handleFinalize = useCallback(
    async (method: ContactMethod) => {
      if (!canFinalize) return;

      if (method === "whatsapp") {
        const url = `${CONTACT_LINKS.whatsapp}?text=${encodeURIComponent(customerBlock)}`;
        window.open(url, "_blank", "noopener,noreferrer");
        return;
      }

      try {
        await navigator.clipboard.writeText(customerBlock);
        setClipboardNotice(null);
        setCopiedFor(method);
        window.setTimeout(() => setCopiedFor(null), 5000);
      } catch {
        setClipboardNotice(
          "Copie impossible (permissions / contexte non sécurisé). Ouvre l'app et recopie les infos depuis le récap ci-dessus."
        );
        window.setTimeout(() => setClipboardNotice(null), 8000);
      }

      window.open(CONTACT_LINKS[method], "_blank", "noopener,noreferrer");
    },
    [canFinalize, customerBlock]
  );

  if (items.length === 0) {
    return (
      <div className="space-y-5 pt-4">
        <SectionTitle title="Finaliser" subtitle="Choisis comment nous envoyer ta commande." />
        <EmptyState icon={ShoppingBag} title="Aucun produit" description="Ajoute des articles à ton panier d'abord." />
        <Button asChild className="w-full">
          <Link href="/catalog">Voir le catalogue</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5 pt-4">
      <SectionTitle
        title="Finaliser 📋"
        subtitle="Renseigne ton adresse et choisis comment nous contacter."
      />

      <form
        id="checkout-delivery"
        className={`space-y-3 transition-opacity duration-200 ${hydrated ? "opacity-100" : "opacity-90"}`}
        autoComplete="on"
        onSubmit={(e) => e.preventDefault()}
      >
        <p className="text-xs text-foreground-muted/80">
          Préremplissage : navigateur (saisie automatique) + dernière session sur cet appareil.
        </p>
        <label className="block space-y-1.5">
          <span className="text-base font-bold text-foreground">
            📍 Adresse de livraison <span className="text-red-400">*</span>
          </span>
          <Textarea
            name="street-address"
            autoComplete="street-address"
            enterKeyHint="done"
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
            placeholder="12 Rue de la Paix, Nancy"
          />
        </label>
      </form>

      <label className="block space-y-1.5">
        <span className="text-sm font-semibold text-foreground-muted">📝 Note supplémentaire</span>
        <Textarea
          name="order-notes"
          autoComplete="off"
          value={form.note ?? ""}
          onChange={(e) => update("note", e.target.value)}
          placeholder="Devant portail gris / Parking près du canal"
        />
      </label>

      <div className="flex items-center gap-3 rounded-2xl bg-accent/10 px-4 py-3 neon-border">
        <Truck className="h-5 w-5 shrink-0 text-accent" strokeWidth={1.8} aria-hidden="true" />
        <span className="text-sm font-bold text-accent">{DELIVERY_LABEL}</span>
      </div>

      <div className="space-y-2">
        <SectionTitle title="Finaliser via" />
        <ContactMethodSelector
          selected={form.preferredContactMethod}
          onSelect={(m) => update("preferredContactMethod", m)}
        />
      </div>

      {!canFinalize && (
        <p className="text-center text-sm text-foreground-muted/50">
          Remplis l&apos;adresse pour continuer.
        </p>
      )}

      {copiedFor && (
        <p className="text-center text-xs font-semibold text-accent" role="status">
          Message copié — colle (Ctrl+V / long appui) dans {copiedFor === "signal" ? "Signal" : "Snapchat"}, puis envoie.
        </p>
      )}

      {clipboardNotice && (
        <p className="text-center text-xs font-semibold text-amber-400/95" role="status">
          {clipboardNotice}
        </p>
      )}

      <div className="space-y-2">
        {sortedMethods.map((method, idx) => (
          <Button
            key={method}
            type="button"
            variant={idx === 0 ? "default" : "outline"}
            className="w-full text-sm"
            disabled={!canFinalize}
            onClick={() => handleFinalize(method)}
          >
            {CTA_LABELS[method]}
          </Button>
        ))}
      </div>

      <div className="rounded-2xl bg-surface p-5 text-center neon-border">
        <p className="text-sm font-semibold text-foreground-muted">Total</p>
        <p className="mt-1 font-display text-3xl text-accent neon-text">{formatPrice(totalToPay)}</p>
      </div>

      <CheckoutPromoSection
        input={promoInput}
        onInputChange={handlePromoInputChange}
        onApply={handleApplyPromo}
        onRemove={handleRemovePromo}
        applied={Boolean(appliedPromo)}
        appliedLabel={appliedPromo?.label}
        error={promoError}
        applying={applyingPromo}
      />

      <OrderSummaryCard
        items={items}
        address={form.address}
        note={form.note}
        promo={promoLine}
      />
    </div>
  );
}
