import Link from "next/link";
import type { CafeSummary, Tag } from "@/lib/cafes";
import { formatPrice } from "@/lib/format";
import { formatDistance } from "@/lib/geo";
import { OpenBadge } from "./OpenBadge";

type Props = {
  cafe: CafeSummary;
  tagNames: Map<string, Tag>;
  distance: number | null;
  selected: boolean;
  onSelect: () => void;
};

export function CafeCard({ cafe, tagNames, distance, selected, onSelect }: Props) {
  const price = formatPrice(cafe.priceMin, cafe.priceMax);
  return (
    <li
      id={`cafe-${cafe.id}`}
      onMouseEnter={onSelect}
      className={`group relative flex gap-3.5 rounded-2xl border p-3 transition-all duration-150 focus-within:ring-2 focus-within:ring-accent focus-within:border-accent ${
        selected
          ? "border-accent bg-accent/5 shadow-xs"
          : "border-line bg-surface hover:border-ink/25 hover:shadow-2xs"
      }`}
    >
      <div className="size-20 shrink-0 overflow-hidden rounded-xl bg-line/60 relative">
        {cafe.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- small thumbnails, credited on the detail page
          <img
            src={cafe.coverUrl}
            alt=""
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div
            className="flex size-full items-center justify-center bg-line/40 text-muted/60"
            aria-hidden="true"
          >
            <svg
              className="size-7"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8h14v7a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8Zm14 2h2a2.5 2.5 0 0 1 0 5h-2M2 19h18"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-semibold text-ink group-hover:text-espresso transition-colors">
          <Link href={`/cafe/${cafe.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {cafe.name}
          </Link>
        </h3>
        <p className="mt-0.5 text-xs sm:text-sm text-muted">
          {[cafe.city, distance != null ? formatDistance(distance) : null, price].filter(Boolean).join(" · ")}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <OpenBadge open={cafe.openNow} />
          {cafe.tags.slice(0, 2).map((slug) => (
            <span
              key={slug}
              className="rounded-full bg-ink/5 px-2 py-0.5 text-xs text-ink/70"
            >
              {tagNames.get(slug)?.name ?? slug}
            </span>
          ))}
          {cafe.tags.length > 2 && (
            <span className="text-xs text-muted font-medium">+{cafe.tags.length - 2}</span>
          )}
        </div>
      </div>
    </li>
  );
}
