"use client";

interface CategoryPillsProps {
  categories: string[];
  active: string | null;
  onChange: (category: string | null) => void;
}

export function CategoryPills({ categories, active, onChange }: CategoryPillsProps): JSX.Element {
  return (
    <div role="tablist" aria-label="Product categories" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-1">
      <button
        role="tab"
        aria-selected={!active}
        onClick={() => onChange(null)}
        className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 ${
          !active
            ? "bg-accent text-background shadow-neon"
            : "bg-surface text-foreground-muted neon-border hover:text-foreground"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          role="tab"
          aria-selected={active === cat}
          onClick={() => onChange(cat)}
          className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 ${
            active === cat
              ? "bg-accent text-background shadow-neon"
              : "bg-surface text-foreground-muted neon-border hover:text-foreground"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
