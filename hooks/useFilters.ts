"use client";

import { useMemo, useState } from "react";

import type { Product } from "@/types/product";

export type SortOption = "featured" | "price-asc" | "price-desc" | "name";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Populaires" },
  { value: "price-asc", label: "Prix ↑" },
  { value: "price-desc", label: "Prix ↓" },
  { value: "name", label: "Nom (A–Z)" }
];

const VALID_SORTS = new Set<string>(SORT_OPTIONS.map((o) => o.value));

export function isSortOption(value: string): value is SortOption {
  return VALID_SORTS.has(value);
}

export function useFilters(products: Product[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeTag, setActiveTag] = useState<string>("All");
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    products.forEach((product) => {
      product.tags.forEach((tag) => tags.add(tag));
    });
    return ["All", ...Array.from(tags)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const lowered = searchQuery.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const matchCategory = activeCategory === "All" || product.category === activeCategory;
      const matchTag = activeTag === "All" || product.tags.includes(activeTag as Product["tags"][number]);
      const matchSearch =
        lowered.length === 0 ||
        product.name.toLowerCase().includes(lowered) ||
        product.shortDescription.toLowerCase().includes(lowered);

      return matchCategory && matchTag && matchSearch;
    });

    const sorted = [...filtered];
    if (sortBy === "price-asc") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
    }

    return sorted;
  }, [activeCategory, activeTag, products, searchQuery, sortBy]);

  return {
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    activeTag,
    setActiveTag,
    sortBy,
    setSortBy,
    availableTags,
    filteredProducts
  };
}
