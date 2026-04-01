"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Trash2, Save, Loader2, ImageIcon, Upload, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchJson } from "@/lib/fetch-json";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { Product, ProductTag, PriceTier } from "@/types/product";

const ALL_TAGS: ProductTag[] = [
  "Premium",
  "New",
  "Popular",
  "Best Seller",
  "Limited",
  "Sale",
  "Exclusive",
  "Starter"
];

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export interface ProductFormFields {
  name: string;
  subtitle: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  price: number;
  prices: PriceTier[];
  puffs: string;
  flavors: string[];
  image: string;
  stock: number;
  featured: boolean;
  tags: string[];
}

export type ProductFormData = ProductFormFields & { format: string };

interface FieldErrors {
  [key: string]: string | undefined;
}

function validate(data: ProductFormFields): FieldErrors {
  const errors: FieldErrors = {};
  if (!data.name.trim()) errors.name = "Nom requis";
  if (!data.category.trim()) errors.category = "Catégorie requise";
  if (!data.shortDescription.trim()) errors.shortDescription = "Description courte requise";
  if (data.price < 0) errors.price = "Prix invalide";
  if (data.stock < 0) errors.stock = "Stock invalide";
  if (data.image && !/^https?:\/\/.+/i.test(data.image)) errors.image = "URL d'image invalide";
  return errors;
}

export function ProductForm({ initialData, onSubmit, onDelete }: ProductFormProps): JSX.Element {
  const [form, setForm] = useState<ProductFormFields>(() => ({
    name: initialData?.name ?? "",
    subtitle: initialData?.subtitle ?? "",
    category: initialData?.category ?? "",
    shortDescription: initialData?.shortDescription ?? "",
    longDescription: initialData?.longDescription ?? "",
    price: initialData?.price ?? 0,
    prices: initialData?.prices ?? [],
    puffs: initialData?.puffs ?? "",
    flavors: initialData?.flavors ?? [],
    image: initialData?.image ?? "",
    stock: initialData?.stock ?? 0,
    featured: initialData?.featured ?? false,
    tags: initialData?.tags ?? []
  }));

  const [categorySuggestions, setCategorySuggestions] = useState<string[]>([]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [newFlavor, setNewFlavor] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const result = await fetchJson<{ categories?: string[] }>("/api/admin/categories", { cache: "no-store" });
      if (cancelled || !result.ok) return;
      if (Array.isArray(result.data.categories)) setCategorySuggestions(result.data.categories);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const update = useCallback(<K extends keyof ProductFormFields>(field: K, value: ProductFormFields[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const toggleTag = useCallback((tag: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag]
    }));
  }, []);

  const addFlavor = useCallback(() => {
    const trimmed = newFlavor.trim();
    if (!trimmed) return;
    setForm((prev) => ({
      ...prev,
      flavors: prev.flavors.includes(trimmed) ? prev.flavors : [...prev.flavors, trimmed]
    }));
    setNewFlavor("");
  }, [newFlavor]);

  const removeFlavor = useCallback((flavor: string) => {
    setForm((prev) => ({
      ...prev,
      flavors: prev.flavors.filter((f) => f !== flavor)
    }));
  }, []);

  const addPriceTier = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      prices: [...prev.prices, { qty: 1, price: 0 }]
    }));
  }, []);

  const updatePriceTier = useCallback((index: number, field: keyof PriceTier, value: number) => {
    setForm((prev) => ({
      ...prev,
      prices: prev.prices.map((t, i) => i === index ? { ...t, [field]: value } : t)
    }));
  }, []);

  const removePriceTier = useCallback((index: number) => {
    setForm((prev) => ({
      ...prev,
      prices: prev.prices.filter((_, i) => i !== index)
    }));
  }, []);

  const handleFileUpload = useCallback(async (file: File) => {
    setUploading(true);
    setErrors((prev) => ({ ...prev, image: undefined }));
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur upload");
      update("image", data.url);
    } catch (e) {
      setErrors((prev) => ({
        ...prev,
        image: e instanceof Error ? e.message : "Erreur lors de l'upload"
      }));
    } finally {
      setUploading(false);
    }
  }, [update]);

  const handleSubmit = useCallback(async () => {
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSaving(true);
    try {
      await onSubmit({ ...form, format: form.puffs ? `${form.puffs} puffs` : "" });
      setFeedback("Produit sauvegardé");
      setTimeout(() => setFeedback(null), 3000);
    } catch (e) {
      setFeedback(e instanceof Error ? e.message : "Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  }, [form, onSubmit]);

  const handleDelete = useCallback(async () => {
    if (!onDelete) return;
    setDeleting(true);
    try {
      await onDelete();
    } catch {
      setFeedback("Erreur lors de la suppression");
    } finally {
      setDeleting(false);
    }
  }, [onDelete]);

  return (
    <div className="space-y-4 pb-4">
      {/* Image preview */}
      <div className="overflow-hidden rounded-2xl bg-surface neon-border">
        {form.image && /^https?:\/\/.+/i.test(form.image) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={form.image} alt="Preview" className="aspect-video w-full object-cover" />
        ) : (
          <div className="flex aspect-video items-center justify-center">
            <ImageIcon className="h-12 w-12 text-foreground-muted/20" />
          </div>
        )}
      </div>

      {/* Image upload + URL */}
      <div className="space-y-2">
        <span className="text-sm font-semibold text-foreground-muted">Image du produit</span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file);
            e.target.value = "";
          }}
        />
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Upload size={16} className="mr-2" />}
          {uploading ? "Upload en cours…" : "Choisir une photo"}
        </Button>
        <div className="flex items-center gap-2 text-xs text-foreground-muted">
          <div className="h-px flex-1 bg-foreground-muted/20" />
          <span>ou coller une URL</span>
          <div className="h-px flex-1 bg-foreground-muted/20" />
        </div>
        <Input value={form.image} onChange={(e) => update("image", e.target.value)} placeholder="https://..." />
        {errors.image && <p className="text-xs text-red-400">{errors.image}</p>}
      </div>

      {/* Name */}
      <label className="block space-y-1.5">
        <span className="text-sm font-semibold text-foreground-muted">Nom <span className="text-red-400">*</span></span>
        <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="E-HOSE X 60K" />
        {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
      </label>

      {/* Subtitle */}
      <label className="block space-y-1.5">
        <span className="text-sm font-semibold text-foreground-muted">Marque / Sous-titre</span>
        <Input value={form.subtitle} onChange={(e) => update("subtitle", e.target.value)} placeholder="AL FAKHER • Crown Bar" />
      </label>

      {/* Category */}
      <label className="block space-y-1.5">
        <span className="text-sm font-semibold text-foreground-muted">Catégorie <span className="text-red-400">*</span></span>
        <Input value={form.category} onChange={(e) => update("category", e.target.value)} placeholder="Puffs" list="category-suggestions" />
        <datalist id="category-suggestions">
          {categorySuggestions.map((c) => <option key={c} value={c} />)}
        </datalist>
        {errors.category && <p className="text-xs text-red-400">{errors.category}</p>}
      </label>

      {/* Puffs */}
      <label className="block space-y-1.5">
        <span className="text-sm font-semibold text-foreground-muted">Nombre de puffs</span>
        <Input value={form.puffs} onChange={(e) => update("puffs", e.target.value)} placeholder="60 000" />
      </label>

      {/* Short description */}
      <label className="block space-y-1.5">
        <span className="text-sm font-semibold text-foreground-muted">Description courte <span className="text-red-400">*</span></span>
        <Input value={form.shortDescription} onChange={(e) => update("shortDescription", e.target.value)} placeholder="Puff rechargeable 60K bouffées" />
        {errors.shortDescription && <p className="text-xs text-red-400">{errors.shortDescription}</p>}
      </label>

      {/* Long description */}
      <label className="block space-y-1.5">
        <span className="text-sm font-semibold text-foreground-muted">Description longue</span>
        <Textarea value={form.longDescription} onChange={(e) => update("longDescription", e.target.value)} placeholder="Détails complets du produit..." rows={4} />
      </label>

      {/* Tiered pricing */}
      <div className="space-y-2">
        <span className="text-sm font-semibold text-foreground-muted">Tarifs (quantité → prix)</span>
        {form.prices.map((tier, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              type="number"
              min="1"
              inputMode="numeric"
              value={tier.qty || ""}
              onChange={(e) => updatePriceTier(i, "qty", parseInt(e.target.value, 10) || 1)}
              className="w-20"
              placeholder="Qté"
            />
            <span className="text-sm text-foreground-muted">×</span>
            <Input
              type="number"
              step="0.01"
              min="0"
              inputMode="decimal"
              value={tier.price || ""}
              onChange={(e) => updatePriceTier(i, "price", parseFloat(e.target.value) || 0)}
              className="flex-1"
              placeholder="Prix €"
            />
            <button type="button" onClick={() => removePriceTier(i)} className="text-red-400 hover:text-red-300">
              <X size={16} />
            </button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addPriceTier}>
          <Plus size={14} className="mr-1" /> Ajouter un palier
        </Button>
      </div>

      {/* Price (base / unit) */}
      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-1.5">
          <span className="text-sm font-semibold text-foreground-muted">Prix unitaire (€) <span className="text-red-400">*</span></span>
          <Input type="number" step="0.01" min="0" inputMode="decimal" value={form.price || ""} onChange={(e) => update("price", parseFloat(e.target.value) || 0)} />
          {errors.price && <p className="text-xs text-red-400">{errors.price}</p>}
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-semibold text-foreground-muted">Stock <span className="text-red-400">*</span></span>
          <Input type="number" min="0" inputMode="numeric" value={form.stock || ""} onChange={(e) => update("stock", parseInt(e.target.value, 10) || 0)} />
          {errors.stock && <p className="text-xs text-red-400">{errors.stock}</p>}
        </label>
      </div>

      {/* Flavors */}
      <div className="space-y-2">
        <span className="text-sm font-semibold text-foreground-muted">Parfums disponibles</span>
        <div className="flex flex-wrap gap-1.5">
          {form.flavors.map((flavor) => (
            <span key={flavor} className="inline-flex items-center gap-1 rounded-full bg-surface-raised px-2.5 py-1 text-xs font-semibold text-foreground/80">
              {flavor}
              <button type="button" onClick={() => removeFlavor(flavor)} className="text-foreground-muted hover:text-red-400">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newFlavor}
            onChange={(e) => setNewFlavor(e.target.value)}
            placeholder="Grape ice, Menthe..."
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addFlavor(); } }}
          />
          <Button type="button" variant="outline" size="sm" onClick={addFlavor} disabled={!newFlavor.trim()}>
            <Plus size={14} />
          </Button>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-1.5">
        <span className="text-sm font-semibold text-foreground-muted">Tags</span>
        <div className="flex flex-wrap gap-2">
          {ALL_TAGS.map((tag) => {
            const active = form.tags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                  active ? "bg-accent text-background shadow-neon" : "bg-surface text-foreground-muted neon-border hover:text-foreground"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured */}
      <label className="flex items-center gap-3 rounded-2xl bg-surface p-4 neon-border">
        <input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} className="h-5 w-5 rounded accent-accent" />
        <span className="text-sm font-semibold text-foreground-muted">Produit mis en avant</span>
      </label>

      <Button type="button" className="w-full" onClick={handleSubmit} disabled={saving}>
        {saving ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Save size={16} className="mr-2" />}
        {saving ? "Sauvegarde…" : "Sauvegarder"}
      </Button>

      {feedback && (
        <p className="text-center text-sm font-semibold text-accent" role="status">{feedback}</p>
      )}

      {onDelete && !showDeleteConfirm && (
        <Button type="button" variant="outline" className="w-full border-red-400/30 text-red-400 hover:bg-red-400/10" onClick={() => setShowDeleteConfirm(true)}>
          <Trash2 size={16} className="mr-2" /> Supprimer ce produit
        </Button>
      )}

      {showDeleteConfirm && (
        <div className="space-y-2 rounded-2xl border border-red-400/30 bg-red-400/5 p-4">
          <p className="text-sm font-semibold text-red-400">Confirmer la suppression ?</p>
          <p className="text-xs text-foreground-muted">Cette action est irréversible.</p>
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setShowDeleteConfirm(false)} disabled={deleting}>Annuler</Button>
            <Button type="button" className="flex-1 bg-red-500 hover:bg-red-600" onClick={handleDelete} disabled={deleting}>
              {deleting ? <Loader2 size={16} className="animate-spin" /> : "Supprimer"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
