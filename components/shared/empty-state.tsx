import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 neon-border animate-float">
        <Icon className="h-7 w-7 text-accent" strokeWidth={1.6} />
      </div>
      <h3 className="font-display text-lg tracking-wide text-foreground">{title}</h3>
      {description && <p className="mt-1.5 max-w-[260px] text-sm text-foreground-muted">{description}</p>}
    </div>
  );
}
