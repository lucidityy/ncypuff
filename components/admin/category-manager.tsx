"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, X, Loader2, Save, Tag } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchJson } from "@/lib/fetch-json";
import { cn } from "@/lib/utils";

export function CategoryManager(): JSX.Element {
  const [categories, setCategories] = useState<string[]>([]);
  const [newCat, setNewCat] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const result = await fetchJson<{ categories?: string[] }>("/api/admin/categories", { cache: "no-store" });
      if (cancelled) return;
      if (!result.ok) {
        setLoadError(result.error);
      } else if (Array.isArray(result.data.categories)) {
        setCategories(result.data.categories);
        setLoadError(null);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const addCategory = useCallback(() => {
    const val = newCat.trim();
    if (!val) return;
    if (categories.some((c) => c.toLowerCase() === val.toLowerCase())) {
      setFeedback("Cette catégorie existe déjà");
      setTimeout(() => setFeedback(null), 2000);
      return;
    }
    setCategories((prev) => [...prev, val]);
    setNewCat("");
    setDirty(true);
  }, [newCat, categories]);

  const removeCategory = useCallback((cat: string) => {
    setCategories((prev) => prev.filter((c) => c !== cat));
    setDirty(true);
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    const result = await fetchJson<{ categories?: string[] }>("/api/admin/categories", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categories })
    });
    if (!result.ok) {
      setFeedback(result.error);
      setTimeout(() => setFeedback(null), 3000);
    } else if (Array.isArray(result.data.categories)) {
      setCategories(result.data.categories);
      setDirty(false);
      setFeedback("Catégories sauvegardées");
      setTimeout(() => setFeedback(null), 2500);
    }
    setSaving(false);
  }, [categories]);

  if (loading) {
    return (
      <div className="rounded-xl bg-surface p-3 neon-border">
        <p className="text-2xs text-foreground-muted">Chargement…</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-xl bg-surface p-3 neon-border">
        <p className="text-2xs font-semibold text-red-400">{loadError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 rounded-xl bg-surface p-3 neon-border">
      <div className="space-y-0.5">
        <div className="flex items-center gap-1.5">
          <Tag size={14} className="shrink-0 text-accent" strokeWidth={2} />
          <h3 className="font-display text-xs tracking-wide text-foreground">Catégories</h3>
        </div>
        <p className="text-2xs leading-snug text-foreground-muted">
          Affichage sur le catalogue (filtres) et sur les fiches produits.
        </p>
      </div>

      <ul className="space-y-1.5" aria-label="Liste des catégories">
        {categories.map((cat) => (
          <li key={cat} className="flex gap-1.5">
            <div
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "pointer-events-none min-h-9 min-w-0 flex-1 items-center justify-center px-3 text-xs font-bold text-foreground"
              )}
            >
              <span className="truncate">{cat}</span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 w-9 shrink-0 p-0 text-foreground-muted hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-400"
              onClick={() => removeCategory(cat)}
              aria-label={`Supprimer la catégorie ${cat}`}
            >
              <X size={14} strokeWidth={2.5} />
            </Button>
          </li>
        ))}
        {categories.length === 0 && (
          <li className="text-2xs text-foreground-muted">Aucune catégorie — ajoute-en une ci-dessous.</li>
        )}
      </ul>

      <div className="flex gap-1.5">
        <Input
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          placeholder="Nouvelle…"
          className="h-9 flex-1 text-xs"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCategory();
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addCategory}
          disabled={!newCat.trim()}
          className="h-9 shrink-0 px-2.5"
        >
          <Plus size={15} strokeWidth={2.5} />
        </Button>
      </div>

      {feedback && (
        <p className="text-2xs font-semibold text-accent" role="status">
          {feedback}
        </p>
      )}

      <Button
        type="button"
        size="sm"
        className="h-9 w-full text-xs"
        onClick={handleSave}
        disabled={!dirty || saving}
        title={!dirty ? "Aucune modification à enregistrer" : undefined}
      >
        {saving ? (
          <Loader2 size={14} className="mr-1.5 animate-spin" />
        ) : (
          <Save size={14} className="mr-1.5" />
        )}
        {saving ? "Sauvegarde…" : "Sauvegarder"}
      </Button>
    </div>
  );
}
