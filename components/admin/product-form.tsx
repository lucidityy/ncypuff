"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Trash2, Save, Loader2, Upload, Plus, X, RefreshCw, Crop } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchJson } from "@/lib/fetch-json";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { Product, ProductTag, PriceTier } from "@/types/product";

const BRAND_OPTIONS = [
  { value: "R&M • Monster Series",      label: "R&M",       color: "#34d399" },
  { value: "JNR • Just No Reason",      label: "JNR",       color: "#60a5fa" },
  { value: "ADALYA • Love Series",      label: "ADALYA",    color: "#f472b6" },
  { value: "AL FAKHER • Crown Bar",     label: "AL FAKHER", color: "#fbbf24" },
  { value: "PABLO • Nicotine Pouches",  label: "PABLO",     color: "#f472b6" },
] as const;

const CATEGORY_OPTIONS = ["Puffs", "Snus"] as const;

const PUFF_OPTIONS = [
  "9 000", "16 000", "18 000", "20 000", "22 000",
  "28 000", "40 000", "48 000", "55 000", "60 000", "SNUS",
] as const;

const ALL_FLAVORS = [
  "Fruit rouge myrtille", "Lush ice", "Fraise punch", "Gum mint", "Space dream (myrtille orange)",
  "Raisin fruit rouge", "Cerise", "Myrtille menthe", "Myrtille cerise", "Fruit rouge",
  "Cherry cola", "Myrtille framboise", "Juicy pêche", "White pêche razz",
  "Watermelon ice", "Blue razz", "Grape ice", "Mango ice", "Strawberry banana",
  "Fraise kiwi", "Menthe glaciale", "Pastèque ice", "Mangue ananas", "Raisin glacé",
  "Blue razz lemon", "Cerise vanille", "Tropical punch", "Framboise menthe", "Peach ice",
  "Watermelon bubblegum", "Strawberry mango", "Lychee ice", "Cola glace", "Kiwi passion",
  "Love 66 (pêche fraise)", "Blueberry mint", "Mango tango", "Double apple", "Pink lemonade",
  "Cherry lemon", "Grape mint", "Fraise pastèque", "Sour apple ice", "Passion ice",
  "Blue slush", "Mango peach ice", "Strawberry watermelon", "Pineapple coconut", "Berry blast",
  "Ice cold mint", "Frosted mint", "Banana ice", "Watermelon", "Bubblegum",
];

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
  imagePosition: string;
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
  if (data.image && !/^(https?:\/\/.+|\/\S+)/i.test(data.image)) errors.image = "URL d'image invalide";
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
    imagePosition: initialData?.imagePosition ?? "50%",
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
  const [customFlavorInput, setCustomFlavorInput] = useState("");
  const [showCustomFlavor, setShowCustomFlavor] = useState(false);
  const [customBrandInput, setCustomBrandInput] = useState("");
  const [showCustomBrand, setShowCustomBrand] = useState(false);
  const customFlavorRef = useRef<HTMLInputElement>(null);
  const customBrandRef = useRef<HTMLInputElement>(null);
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

  const resizeImage = useCallback((file: File, maxPx = 1200, quality = 0.88): Promise<File> => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const { naturalWidth: w, naturalHeight: h } = img;
        const scale = Math.min(1, maxPx / Math.max(w, h));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(w * scale);
        canvas.height = Math.round(h * scale);
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => resolve(blob ? new File([blob], file.name.replace(/\.\w+$/, ".webp"), { type: "image/webp" }) : file),
          "image/webp",
          quality
        );
      };
      img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
      img.src = url;
    });
  }, []);

  const handleFileUpload = useCallback(async (file: File) => {
    setUploading(true);
    setErrors((prev) => ({ ...prev, image: undefined }));
    try {
      const resized = await resizeImage(file);
      const body = new FormData();
      body.append("file", resized);
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
      {/* Photo */}
      <div className="space-y-2">
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleFileUpload(f); e.target.value = ""; }} />

        {form.image && /^(https?:\/\/.+|\/\S+)/i.test(form.image) ? (
          /* ── Image preview with action overlay + position control ── */
          <div className="space-y-2">
            <div className="group relative overflow-hidden rounded-2xl neon-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.image}
                alt="Preview"
                className="aspect-video w-full object-cover transition-all duration-300"
                style={{ objectPosition: `center ${form.imagePosition}` }}
              />

              {/* Upload spinner overlay */}
              {uploading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 backdrop-blur-sm">
                  <Loader2 size={28} className="animate-spin text-accent" />
                  <span className="text-xs font-semibold text-white">Traitement…</span>
                </div>
              )}

              {/* Hover action overlay */}
              {!uploading && (
                <div className="absolute inset-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-2 text-xs font-bold text-white backdrop-blur-sm transition-all hover:bg-white/25 active:scale-95"
                  >
                    <RefreshCw size={12} /> Remplacer
                  </button>
                  <button
                    type="button"
                    onClick={() => update("image", "")}
                    className="flex items-center gap-1.5 rounded-xl bg-red-500/70 px-3 py-2 text-xs font-bold text-white backdrop-blur-sm transition-all hover:bg-red-500/90 active:scale-95"
                  >
                    <X size={12} /> Supprimer
                  </button>
                </div>
              )}

              {/* Resize badge */}
              {!uploading && (
                <div className="absolute right-2 top-2 flex items-center gap-1 rounded-lg bg-black/50 px-2 py-1 text-[10px] font-semibold text-white/70 backdrop-blur-sm">
                  <Crop size={10} /> Auto 1200px · WEBP
                </div>
              )}
            </div>

            {/* ── Focal point / position control ── */}
            <div className="flex items-center gap-3 rounded-xl px-3 py-2.5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <span className="shrink-0 text-xs font-bold uppercase tracking-widest text-foreground-muted/50">
                Cadrage
              </span>
              {/* Quick presets */}
              <div className="flex gap-1.5">
                {(["0%", "25%", "50%", "75%", "100%"] as const).map((pos, i) => {
                  const labels = ["Haut", "¼", "Centre", "¾", "Bas"];
                  const selected = form.imagePosition === pos;
                  return (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => update("imagePosition", pos)}
                      title={labels[i]}
                      className="rounded-lg px-2.5 py-1 text-[10px] font-bold transition-all duration-150 active:scale-95"
                      style={{
                        background: selected ? "rgba(168,85,247,0.25)" : "rgba(255,255,255,0.05)",
                        border: `1px solid ${selected ? "rgba(168,85,247,0.7)" : "rgba(255,255,255,0.08)"}`,
                        color: selected ? "#c084fc" : "rgba(240,240,240,0.4)",
                      }}
                    >
                      {labels[i]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* ── Empty state — tap to upload ── */
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="relative w-full overflow-hidden rounded-2xl neon-border transition-all hover:border-accent/50 hover:bg-accent/5 active:scale-[0.99]"
            style={{ background: "rgba(168,85,247,0.04)" }}
          >
            <div className="flex flex-col items-center justify-center gap-2 py-10">
              {uploading
                ? <Loader2 size={28} className="animate-spin text-accent" />
                : <Upload size={28} className="text-accent/60" />}
              <span className="text-sm font-semibold text-foreground-muted">
                {uploading ? "Traitement…" : "Appuyer pour choisir une photo"}
              </span>
              {!uploading && (
                <span className="text-xs text-foreground-muted/40">Auto-redimensionné · max 1200px · WEBP</span>
              )}
            </div>
          </button>
        )}

        {errors.image && <p className="text-xs text-red-400">{errors.image}</p>}
      </div>

      {/* Nom */}
      <label className="block space-y-1.5">
        <span className="text-xs font-bold uppercase tracking-widest text-foreground-muted/60">Nom <span className="text-red-400">*</span></span>
        <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="E-HOSE X 60K" />
        {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
      </label>

      {/* Marque */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-foreground-muted/60">Marque</span>
        <div className="flex flex-wrap gap-2">
          {BRAND_OPTIONS.map((b) => {
            const selected = form.subtitle === b.value;
            return (
              <button
                key={b.value}
                type="button"
                onClick={() => update("subtitle", selected ? "" : b.value)}
                className="rounded-xl px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-95"
                style={{
                  background: selected ? `${b.color}22` : "rgba(255,255,255,0.04)",
                  border: `1px solid ${selected ? b.color : "rgba(255,255,255,0.08)"}`,
                  color: selected ? b.color : "rgba(240,240,240,0.45)",
                  boxShadow: selected ? `0 0 12px ${b.color}44` : "none",
                }}
              >
                {b.label}
              </button>
            );
          })}
        </div>

        {/* Custom brand input */}
        {showCustomBrand ? (
          <div className="flex gap-2">
            <input
              ref={customBrandRef}
              value={customBrandInput}
              onChange={(e) => setCustomBrandInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const v = customBrandInput.trim();
                  if (v) { update("subtitle", v); setCustomBrandInput(""); setShowCustomBrand(false); }
                }
                if (e.key === "Escape") { setShowCustomBrand(false); setCustomBrandInput(""); }
              }}
              placeholder="Nom de la marque…"
              className="flex h-9 flex-1 rounded-xl bg-surface-raised px-3 text-sm text-foreground placeholder:text-foreground-muted/40 outline-none focus:ring-2 focus:ring-accent/40 neon-border"
              autoFocus
            />
            <button
              type="button"
              onClick={() => {
                const v = customBrandInput.trim();
                if (v) { update("subtitle", v); setCustomBrandInput(""); setShowCustomBrand(false); }
              }}
              className="flex h-9 items-center gap-1.5 rounded-xl bg-accent/15 px-3 text-xs font-bold text-accent transition-all hover:bg-accent/25 active:scale-95"
            >
              <Plus size={13} /> OK
            </button>
            <button
              type="button"
              onClick={() => { setShowCustomBrand(false); setCustomBrandInput(""); }}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-foreground-muted/50 hover:text-foreground-muted transition-all"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => { setShowCustomBrand(true); setTimeout(() => customBrandRef.current?.focus(), 50); }}
            className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold text-foreground-muted/50 transition-all hover:text-foreground-muted hover:bg-white/5 active:scale-95"
            style={{ border: "1px dashed rgba(255,255,255,0.12)" }}
          >
            <Plus size={12} /> Nouvelle marque
          </button>
        )}
        {form.subtitle && !BRAND_OPTIONS.some(b => b.value === form.subtitle) && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-foreground-muted/60">Marque custom :</span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/8 px-2.5 py-1 text-xs font-bold text-foreground">
              {form.subtitle}
              <button type="button" onClick={() => update("subtitle", "")} className="text-foreground-muted/50 hover:text-foreground-muted">
                <X size={11} />
              </button>
            </span>
          </div>
        )}
      </div>

      {/* Catégorie */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-foreground-muted/60">
          Catégorie <span className="text-red-400">*</span>
        </span>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORY_OPTIONS.map((cat) => {
            const selected = form.category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => update("category", cat)}
                className="rounded-xl py-2.5 text-sm font-bold transition-all duration-150 active:scale-95"
                style={{
                  background: selected ? "rgba(168,85,247,0.18)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${selected ? "rgba(168,85,247,0.6)" : "rgba(255,255,255,0.08)"}`,
                  color: selected ? "#c084fc" : "rgba(240,240,240,0.45)",
                  boxShadow: selected ? "0 0 14px rgba(168,85,247,0.3)" : "none",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
        {errors.category && <p className="text-xs text-red-400">{errors.category}</p>}
      </div>

      {/* Puffs */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-foreground-muted/60">Format</span>
        <div className="grid grid-cols-3 gap-2">
          {PUFF_OPTIONS.map((p) => {
            const selected = form.puffs === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => update("puffs", selected ? "" : p)}
                className="rounded-xl py-2.5 text-xs font-bold transition-all duration-150 active:scale-95"
                style={{
                  background: selected ? "rgba(168,85,247,0.18)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${selected ? "rgba(168,85,247,0.6)" : "rgba(255,255,255,0.08)"}`,
                  color: selected ? "#c084fc" : "rgba(240,240,240,0.45)",
                  boxShadow: selected ? "0 0 14px rgba(168,85,247,0.3)" : "none",
                }}
              >
                {p === "SNUS" ? "SNUS" : `${p}K`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Description courte */}
      <label className="block space-y-1.5">
        <span className="text-xs font-bold uppercase tracking-widest text-foreground-muted/60">Description <span className="text-red-400">*</span></span>
        <Input value={form.shortDescription} onChange={(e) => update("shortDescription", e.target.value)} placeholder="Puff rechargeable 60K bouffées" />
        {errors.shortDescription && <p className="text-xs text-red-400">{errors.shortDescription}</p>}
      </label>

      {/* Prix */}
      <label className="block space-y-1.5">
        <span className="text-xs font-bold uppercase tracking-widest text-foreground-muted/60">Prix unitaire € <span className="text-red-400">*</span></span>
        <Input type="number" step="0.01" min="0" inputMode="decimal" value={form.price || ""} onChange={(e) => update("price", parseFloat(e.target.value) || 0)} />
        {errors.price && <p className="text-xs text-red-400">{errors.price}</p>}
      </label>

      {/* Tarifs paliers */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-foreground-muted/60">Tarifs dégressifs</span>
        {form.prices.map((tier, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input type="number" min="1" inputMode="numeric" value={tier.qty || ""} onChange={(e) => updatePriceTier(i, "qty", parseInt(e.target.value, 10) || 1)} className="w-20" placeholder="Qté" />
            <span className="text-sm text-foreground-muted shrink-0">→</span>
            <Input type="number" step="0.01" min="0" inputMode="decimal" value={tier.price || ""} onChange={(e) => updatePriceTier(i, "price", parseFloat(e.target.value) || 0)} className="flex-1" placeholder="Prix €" />
            <button type="button" onClick={() => removePriceTier(i)} className="shrink-0 rounded-lg p-2 text-red-400 hover:bg-red-400/10"><X size={16} /></button>
          </div>
        ))}
        <Button type="button" variant="outline" className="w-full" onClick={addPriceTier}>
          <Plus size={14} className="mr-1" /> Ajouter un palier
        </Button>
      </div>

      {/* Parfums */}
      <div className="space-y-3">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-foreground-muted/60">Parfums</span>
          {form.flavors.length > 0 && (
            <span className="text-xs text-foreground-muted/40">{form.flavors.length} sélectionné{form.flavors.length > 1 ? "s" : ""}</span>
          )}
        </div>

        {/* Selected pills */}
        {form.flavors.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {form.flavors.map((flavor) => (
              <button key={flavor} type="button" onClick={() => removeFlavor(flavor)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-accent/15 px-3 py-2 text-xs font-semibold text-accent border border-accent/30 active:scale-95">
                {flavor} <X size={13} />
              </button>
            ))}
          </div>
        )}

        {/* Filter from list */}
        <Input value={newFlavor} onChange={(e) => setNewFlavor(e.target.value)}
          placeholder="Filtrer parmi les parfums…"
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addFlavor(); } }} />

        {/* Suggestions grid — only when typing */}
        {newFlavor.trim() !== "" && (
          <div className="grid grid-cols-2 gap-2">
            {ALL_FLAVORS.filter(
              (f) => !form.flavors.includes(f) && f.toLowerCase().includes(newFlavor.toLowerCase())
            ).map((f) => (
              <button key={f} type="button"
                onClick={() => { setForm((prev) => ({ ...prev, flavors: prev.flavors.includes(f) ? prev.flavors : [...prev.flavors, f] })); setNewFlavor(""); }}
                className="rounded-xl border border-white/8 bg-surface-raised px-3 py-3 text-left text-xs font-medium text-foreground-muted transition-all hover:border-accent/40 hover:bg-accent/10 hover:text-foreground active:scale-95">
                {f}
              </button>
            ))}
            {/* If no match — offer to create */}
            {ALL_FLAVORS.filter(f => f.toLowerCase().includes(newFlavor.toLowerCase())).length === 0 && (
              <button type="button"
                onClick={() => { const v = newFlavor.trim(); if (v) { setForm((prev) => ({ ...prev, flavors: prev.flavors.includes(v) ? prev.flavors : [...prev.flavors, v] })); setNewFlavor(""); } }}
                className="col-span-2 rounded-xl border border-accent/30 bg-accent/10 px-3 py-3 text-left text-xs font-semibold text-accent transition-all hover:bg-accent/20 active:scale-95">
                <Plus size={12} className="mr-1 inline" /> Ajouter « {newFlavor.trim()} »
              </button>
            )}
          </div>
        )}

        {/* Custom flavor — manual entry */}
        {showCustomFlavor ? (
          <div className="flex gap-2">
            <input
              ref={customFlavorRef}
              value={customFlavorInput}
              onChange={(e) => setCustomFlavorInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const v = customFlavorInput.trim();
                  if (v) { setForm((prev) => ({ ...prev, flavors: prev.flavors.includes(v) ? prev.flavors : [...prev.flavors, v] })); setCustomFlavorInput(""); setShowCustomFlavor(false); }
                }
                if (e.key === "Escape") { setShowCustomFlavor(false); setCustomFlavorInput(""); }
              }}
              placeholder="Nom du parfum…"
              className="flex h-9 flex-1 rounded-xl bg-surface-raised px-3 text-sm text-foreground placeholder:text-foreground-muted/40 outline-none focus:ring-2 focus:ring-accent/40 neon-border"
              autoFocus
            />
            <button
              type="button"
              onClick={() => {
                const v = customFlavorInput.trim();
                if (v) { setForm((prev) => ({ ...prev, flavors: prev.flavors.includes(v) ? prev.flavors : [...prev.flavors, v] })); setCustomFlavorInput(""); setShowCustomFlavor(false); }
              }}
              className="flex h-9 items-center gap-1.5 rounded-xl bg-accent/15 px-3 text-xs font-bold text-accent transition-all hover:bg-accent/25 active:scale-95"
            >
              <Plus size={13} /> OK
            </button>
            <button
              type="button"
              onClick={() => { setShowCustomFlavor(false); setCustomFlavorInput(""); }}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-foreground-muted/50 hover:text-foreground-muted transition-all"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => { setShowCustomFlavor(true); setTimeout(() => customFlavorRef.current?.focus(), 50); }}
            className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold text-foreground-muted/50 transition-all hover:text-foreground-muted hover:bg-white/5 active:scale-95"
            style={{ border: "1px dashed rgba(255,255,255,0.12)" }}
          >
            <Plus size={12} /> Nouveau parfum
          </button>
        )}
      </div>

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
