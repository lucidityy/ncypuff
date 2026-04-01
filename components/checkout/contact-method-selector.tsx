"use client";

import type { ContactMethod } from "@/types/checkout";

interface ContactMethodSelectorProps {
  selected: ContactMethod;
  onSelect: (method: ContactMethod) => void;
}

const METHODS: { value: ContactMethod; label: string; emoji: string }[] = [
  { value: "whatsapp", label: "WhatsApp", emoji: "💬" },
  { value: "signal", label: "Signal", emoji: "🔐" },
  { value: "snapchat", label: "Snapchat", emoji: "👻" }
];

export function ContactMethodSelector({ selected, onSelect }: ContactMethodSelectorProps): JSX.Element {
  return (
    <div role="radiogroup" aria-label="Moyen de finalisation" className="flex flex-col gap-2 sm:flex-row">
      {METHODS.map(({ value, label, emoji }) => (
        <button
          key={value}
          role="radio"
          aria-checked={selected === value}
          onClick={() => onSelect(value)}
          className={`flex flex-1 flex-col items-center gap-1 rounded-2xl py-3 px-2 text-center transition-all duration-200 ${
            selected === value
              ? "bg-accent/15 text-accent neon-border shadow-glow"
              : "bg-surface text-foreground-muted hover:text-foreground neon-border"
          }`}
        >
          <span className="text-lg">{emoji}</span>
          <span className="text-xs font-bold">{label}</span>
        </button>
      ))}
    </div>
  );
}
