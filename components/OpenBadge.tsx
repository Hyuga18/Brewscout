export function OpenBadge({ open }: { open: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${
        open ? "bg-open/10 text-open" : "bg-ink/5 text-muted"
      }`}
    >
      <span className={`size-1.5 rounded-full ${open ? "bg-open" : "bg-muted/60"}`} aria-hidden />
      {open ? "Open now" : "Closed"}
    </span>
  );
}
