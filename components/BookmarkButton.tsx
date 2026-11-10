"use client";

import { useScoutlist } from "@/lib/scoutlist";

export function BookmarkButton({
  cafeId,
  cafeName,
  size = "md",
}: {
  cafeId: string;
  cafeName: string;
  size?: "sm" | "md";
}) {
  const { isSaved, toggle } = useScoutlist();
  const saved = isSaved(cafeId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(cafeId);
  };

  const dimensionClass = size === "sm" ? "size-8" : "size-9";

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={saved}
      title={saved ? `Remove ${cafeName} from Scoutlist` : `Save ${cafeName} to Scoutlist`}
      aria-label={saved ? `Remove ${cafeName} from Scoutlist` : `Save ${cafeName} to Scoutlist`}
      className={`group relative inline-flex ${dimensionClass} items-center justify-center rounded-full border transition-all duration-200 active:scale-90 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent before:absolute before:-inset-2 before:content-[''] ${
        saved
          ? "border-accent bg-accent/15 text-accent shadow-xs"
          : "border-line bg-surface text-muted hover:border-ink/40 hover:text-ink shadow-2xs"
      }`}
    >
      <svg
        className={`size-4 transition-transform duration-200 group-hover:scale-110 ${
          saved ? "fill-accent stroke-accent" : "fill-none stroke-current"
        }`}
        viewBox="0 0 24 24"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
}
