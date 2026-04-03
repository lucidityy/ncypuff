"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Save, Tag, Trash2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchJson } from "@/lib/fetch-json";
import { cn } from "@/lib/utils";
import { formatQuantity } from "@/lib/format";
import type { PromoCodeRecord, PromoKind } from "@/types/promo";
import type { Product } from "@/types/product";

function newDraft(): PromoCodeRecord {
  return {
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `p-${Date.now()}`,
    code: "",
    kind: "percent",
    value: 10,
    label: "−10 %",
    active: true
  };
}

interface PromoManagerProps {
  /** Sans carte externe (dans un panneau repliable). */
  embedded?: boolean;
}

export function PromoManager({ embedded = false }: PromoManagerProps): JSX.Element {
  const [promoCodes, setPromoCodes] = useState<PromoCodeRecord[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoading(true);
      const [promoRes, prodRes] = await Promise.all([
        fetchJson<{ promoCodes?: PromoCodeRecord[] }>("/api/admin/promo-codes", { cache: "no-store" }),
        fetchJson<{ products?: Product[] }>("/api/products", { cache: "no-store" })
      ]);
      if (cancelled) return;
      if (!promoRes.ok) {
        setLoadError(promoRes.error);
        setLoading(false);
        return;
      }
      if (!prodRes.ok) {
        setLoadError(prodRes.error);
        setLoading(false);
        return;
      }
      if (Array.isArray(promoRes.data.promoCodes)) setPromoCodes(promoRes.data.promoCodes);
      if (Array.isArray(prodRes.data.products)) setProducts(prodRes.data.products);
      setLoadError(null);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const updateRow = useCallback((id: string, patch: Partial<PromoCodeRecord>) => {
    setPromoCodes((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    setDirty(true);
  }, []);

  const removeRow = useCallback((id: string) => {
    setPromoCodes((prev) => prev.filter((p) => p.id !== id));
    setDirty(true);
  }, []);

  const addRow = useCallback(() => {
    setPromoCodes((prev) => [...prev, newDraft()]);
    setDirty(true);
  }, []);

  const handleSave = useCallback(async () => {
    const invalid = promoCodes.some((p) => {
      if (!p.code.trim() || !p.label.trim() || !(p.value > 0)) return true;
      if (p.kind === "percent" && p.value > 100) return true;
      if (p.kind === "sample") {
        if (!p.productId?.trim()) return true;
        if (p.value > 500) return true;
      }
      return false;
    });
    if (invalid) {
      setFeedback("Vérifie chaque ligne : code, libellé ; % ≤ 100 ; échantillon = produit + grammes (≤ 500 g).");
      setTimeout(() => setFeedback(null), 4000);
      return;
    }

    const upperCodes = promoCodes.map((p) => ({
      ...p,
      code: p.code.trim().toUpperCase(),
      productId: p.kind === "sample" ? p.productId?.trim() : undefined
    }));
    const keys = upperCodes.map((p) => p.code);
    if (new Set(keys).size !== keys.length) {
      setFeedback("Deux codes identiques — modifie les doublons.");
      setTimeout(() => setFeedback(null), 4000);
      return;
    }

    setSaving(true);
    const result = await fetchJson<{ promoCodes?: PromoCodeRecord[]; error?: string }>("/api/admin/promo-codes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ promoCodes: upperCodes })
    });
    if (!result.ok) {
      setFeedback(result.error);
      setTimeout(() => setFeedback(null), 4000);
    } else if (Array.isArray(result.data.promoCodes)) {
      setPromoCodes(result.data.promoCodes);
      setDirty(false);
      setFeedback("Codes promo enregistrés");
      setTimeout(() => setFeedback(null), 2500);
    } else {
      setFeedback("Réponse serveur inattendue");
      setTimeout(() => setFeedback(null), 4000);
    }
    setSaving(false);
  }, [promoCodes]);

  if (loading) {
    return (
      <div
        className={cn(
          !embedded && "rounded-2xl bg-surface p-4 neon-border",
          embedded && "py-1"
        )}
      >
        <p className="text-sm text-foreground-muted">Chargement des codes promo…</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div
        className={cn(
          !embedded && "rounded-2xl bg-surface p-4 neon-border",
          embedded && "py-1"
        )}
      >
        <p className="text-sm font-semibold text-red-400">{loadError}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "space-y-3",
        !embedded && "rounded-2xl bg-surface p-4 neon-border"
      )}
    >
      <div className="flex items-center gap-2">
        <Tag size={16} className="text-accent" />
        <h3 className="font-display text-sm tracking-wide text-foreground">Codes promo</h3>
      </div>
      <p className="text-2xs text-foreground-muted">
        Pourcentage ou montant fixe (€) sur le sous-total, ou échantillon : grammes offerts sur un produit
        (réduction = prix au g × g, plafonnée au panier). Validation au checkout.
      </p>

      <div className="space-y-3">
        {promoCodes.map((row) => (
          <div
            key={row.id}
            className="space-y-2 rounded-xl border border-border/40 bg-background/40 p-3"
          >
            <div className="grid grid-cols-2 gap-2">
              <label className="space-y-0.5">
                <span className="text-2xs font-semibold text-foreground-muted">Code</span>
                <Input
                  value={row.code}
                  onChange={(e) => updateRow(row.id, { code: e.target.value.toUpperCase() })}
                  placeholder="CW10"
                  className="font-mono text-xs uppercase"
                />
              </label>
              <label className="space-y-0.5">
                <span className="text-2xs font-semibold text-foreground-muted">Type</span>
                <select
                  value={row.kind}
                  onChange={(e) => {
                    const kind = e.target.value as PromoKind;
                    if (kind === "percent") {
                      updateRow(row.id, { kind, value: 10, label: "−10 %", productId: undefined });
                    } else if (kind === "fixed") {
                      updateRow(row.id, { kind, value: 5, label: "−5 €", productId: undefined });
                    } else {
                      const firstId = products[0]?.id ?? "";
                      updateRow(row.id, {
                        kind: "sample",
                        value: 1,
                        label: "1 g offert",
                        productId: firstId || undefined
                      });
                    }
                  }}
                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground"
                >
                  <option value="percent">Pourcentage</option>
                  <option value="fixed">Montant fixe (€)</option>
                  <option value="sample">Échantillon (g × produit)</option>
                </select>
              </label>
            </div>

            {row.kind === "sample" ? (
              <>
                <label className="block space-y-0.5">
                  <span className="text-2xs font-semibold text-foreground-muted">Produit offert</span>
                  <select
                    value={row.productId ?? ""}
                    onChange={(e) => updateRow(row.id, { productId: e.target.value })}
                    className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground"
                  >
                    <option value="">— Choisir un produit —</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="space-y-0.5">
                    <span className="text-2xs font-semibold text-foreground-muted">Grammes offerts</span>
                    <Input
                      type="number"
                      step="0.5"
                      min="0.5"
                      inputMode="decimal"
                      value={row.value || ""}
                      onChange={(e) => updateRow(row.id, { value: parseFloat(e.target.value) || 0 })}
                    />
                  </label>
                  <label className="space-y-0.5">
                    <span className="text-2xs font-semibold text-foreground-muted">Libellé (checkout)</span>
                    <Input
                      value={row.label}
                      onChange={(e) => updateRow(row.id, { label: e.target.value })}
                      placeholder="1 g offert"
                    />
                  </label>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <label className="space-y-0.5">
                  <span className="text-2xs font-semibold text-foreground-muted">
                    {row.kind === "percent" ? "Valeur (%)" : "Montant (€)"}
                  </span>
                  <Input
                    type="number"
                    step={row.kind === "percent" ? "1" : "0.01"}
                    min="0"
                    inputMode="decimal"
                    value={row.value || ""}
                    onChange={(e) => updateRow(row.id, { value: parseFloat(e.target.value) || 0 })}
                  />
                </label>
                <label className="space-y-0.5">
                  <span className="text-2xs font-semibold text-foreground-muted">Libellé (checkout)</span>
                  <Input
                    value={row.label}
                    onChange={(e) => updateRow(row.id, { label: e.target.value })}
                    placeholder="−10 %"
                  />
                </label>
              </div>
            )}

            <div className="flex items-center justify-between gap-2">
              <label className="flex cursor-pointer items-center gap-2 text-xs text-foreground-muted">
                <input
                  type="checkbox"
                  checked={row.active}
                  onChange={(e) => updateRow(row.id, { active: e.target.checked })}
                  className="h-4 w-4 rounded border-border accent-accent"
                />
                Actif
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                onClick={() => removeRow(row.id)}
                aria-label="Supprimer ce code"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button type="button" variant="outline" className="w-full" onClick={addRow}>
        <Plus size={16} className="mr-2" />
        Ajouter un code
      </Button>

      {feedback && (
        <p className="text-xs font-semibold text-accent" role="status">
          {feedback}
        </p>
      )}

      <Button type="button" className="w-full" onClick={handleSave} disabled={!dirty || saving}>
        {saving ? (
          <Loader2 size={16} className="mr-2 animate-spin" />
        ) : (
          <Save size={16} className="mr-2" />
        )}
        {saving ? "Sauvegarde…" : "Sauvegarder les codes promo"}
      </Button>
    </div>
  );
}
