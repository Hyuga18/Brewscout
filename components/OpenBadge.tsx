type Props = {
  open: boolean;
  compact?: boolean;
  className?: string;
};

export function OpenBadge({ open, compact = false, className = "" }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold select-none border transition-colors ${
        open
          ? "border-open/30 bg-open-bg text-open shadow-2xs"
          : "border-line bg-surface text-muted"
      } ${className}`}
    >
      <span className="flex size-1.5 rounded-full shrink-0 items-center justify-center" aria-hidden="true">
        <span className={`size-1.5 rounded-full ${open ? "bg-open" : "bg-muted/60"}`} />
      </span>
      <span>{open ? (compact ? "Open" : "Open now") : "Closed"}</span>
    </span>
  );
}
