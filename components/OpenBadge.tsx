type Props = {
  open: boolean;
  className?: string;
};

export function OpenBadge({ open, className = "" }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold select-none border transition-colors ${
        open
          ? "border-open/30 bg-[#edf7f1] text-open shadow-2xs"
          : "border-line bg-surface text-muted"
      } ${className}`}
    >
      <span className="relative flex size-2 items-center justify-center" aria-hidden="true">
        {open && (
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-open opacity-75" />
        )}
        <span className={`size-1.5 rounded-full ${open ? "bg-open" : "bg-muted/60"}`} />
      </span>
      <span>{open ? "Open now" : "Closed"}</span>
    </span>
  );
}
