"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type SortOption, SORT_OPTIONS, isSortOption } from "@/hooks/useFilters";

interface FilterBarProps {
  tags: string[];
  activeTag: string;
  onTagChange: (value: string) => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
}

export function FilterBar({ tags, activeTag, onTagChange, sortBy, onSortChange }: FilterBarProps): JSX.Element {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Select value={activeTag} onValueChange={onTagChange}>
        <SelectTrigger>
          <SelectValue placeholder="Filtrer" />
        </SelectTrigger>
        <SelectContent>
          {tags.map((tag) => (
            <SelectItem key={tag} value={tag}>{tag}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={sortBy} onValueChange={(v) => { if (isSortOption(v)) onSortChange(v); }}>
        <SelectTrigger>
          <SelectValue placeholder="Trier" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map(({ value, label }) => (
            <SelectItem key={value} value={value}>{label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
