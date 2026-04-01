interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionTitle({ title, subtitle, className = "" }: SectionTitleProps): JSX.Element {
  return (
    <div className={`mb-5 ${className}`}>
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 max-w-[24px] bg-gradient-to-r from-accent to-transparent" aria-hidden="true" />
        <h2 className="font-display text-xl font-bold tracking-tight gradient-text">
          {title}
        </h2>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent via-accent/30 to-transparent" aria-hidden="true" />
      </div>
      {subtitle && (
        <p className="mt-1 text-center text-sm text-foreground-muted">{subtitle}</p>
      )}
    </div>
  );
}
