import { formatPrice } from "@/lib/format";

interface PriceBlockProps {
  label: string;
  amount: number;
  large?: boolean;
}

export function PriceBlock({ label, amount, large }: PriceBlockProps): JSX.Element {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-sm font-semibold text-foreground-muted">{label}</span>
      <span className={`font-bold text-accent neon-text ${large ? "font-display text-xl tracking-wide" : "text-base"}`}>
        {formatPrice(amount)}
      </span>
    </div>
  );
}
