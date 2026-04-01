"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Search } from "lucide-react";

import { SectionTitle } from "@/components/shared/section-title";
import { Input } from "@/components/ui/input";

/** Recherche accueil → /catalog (les rayons sont gérés dans l’admin / filtres catalogue). */
export function HomeCatalogSection(): JSX.Element {
  const router = useRouter();
  const [q, setQ] = useState("");

  const submit = useCallback(() => {
    const trimmed = q.trim();
    const href = trimmed ? `/catalog?q=${encodeURIComponent(trimmed)}` : "/catalog";
    router.push(href);
  }, [q, router]);

  return (
    <div className="space-y-3">
      <SectionTitle
        title="Catalogue"
        subtitle="Recherche un produit ou filtre par catégorie."
      />
      <form
        className="relative"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-accent"
          aria-hidden="true"
        />
        <Input
          type="search"
          name="home-catalog-search"
          autoComplete="off"
          enterKeyHint="search"
          aria-label="Rechercher dans le catalogue"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher un produit…"
          className="pl-11 shadow-glow ring-1 ring-accent/20"
        />
      </form>
    </div>
  );
}
