"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps): JSX.Element {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-accent/50" aria-hidden="true" />
      <Input
        type="search"
        name="catalog-search"
        autoComplete="off"
        enterKeyHint="search"
        aria-label="Rechercher des produits"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Rechercher..."
        className="pl-11"
      />
    </div>
  );
}
