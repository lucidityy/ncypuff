"use client";

import { Loader2, Tag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CheckoutPromoSectionProps {
  input: string;
  onInputChange: (value: string) => void;
  onApply: () => void | Promise<void>;
  onRemove: () => void;
  applied: boolean;
  appliedLabel?: string;
  error: string | null;
  disabled?: boolean;
  applying?: boolean;
}

export function CheckoutPromoSection({
  input,
  onInputChange,
  onApply,
  onRemove,
  applied,
  appliedLabel,
  error,
  disabled,
  applying = false
}: CheckoutPromoSectionProps): JSX.Element {
  return (
    <div className="rounded-2xl bg-surface p-4 neon-border">
      <div className="mb-2 flex items-center gap-2">
        <Tag className="h-4 w-4 text-accent" aria-hidden />
        <span className="font-display text-base tracking-wide text-accent">Code promo</span>
      </div>
      <p className="mb-3 text-xs text-foreground-muted">
        Entre ton code promo (réduction ou échantillon en grammes selon l’offre).
      </p>
      <div className="flex gap-2">
        <Input
          name="promo-code"
          autoComplete="off"
          value={input}
          onChange={(e) => onInputChange(e.target.value.toUpperCase())}
          placeholder="CW10"
          disabled={disabled || applied || applying}
          className="font-mono uppercase"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (!applied && !disabled && !applying) void onApply();
            }
          }}
        />
        {applied ? (
          <Button type="button" variant="outline" onClick={onRemove}>
            Retirer
          </Button>
        ) : (
          <Button
            type="button"
            onClick={() => void onApply()}
            disabled={disabled || applying || !input.trim()}
          >
            {applying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                …
              </>
            ) : (
              "Appliquer"
            )}
          </Button>
        )}
      </div>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      {applied && appliedLabel && (
        <p className="mt-2 text-xs font-semibold text-accent" role="status">
          Code appliqué ({appliedLabel})
        </p>
      )}
    </div>
  );
}
