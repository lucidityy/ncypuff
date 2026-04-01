import type { LucideIcon } from "lucide-react";

interface StoreInfoCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function StoreInfoCard({ icon: Icon, title, description }: StoreInfoCardProps): JSX.Element {
  return (
    <div className="flex items-start gap-3 border-b border-accent/8 p-4 last:border-b-0">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/10">
        <Icon className="h-[1.125rem] w-[1.125rem] text-accent" strokeWidth={1.8} aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <h4 className="font-display text-base tracking-wide text-foreground">{title}</h4>
        <p className="mt-0.5 text-sm text-foreground-muted">{description}</p>
      </div>
    </div>
  );
}
