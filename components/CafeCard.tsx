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
      className={`group relative flex gap-3 rounded-2xl border p-3 transition-colors ${
        selected ? "border-accent bg-accent/5" : "border-line bg-surface hover:border-ink/20"
      }`}
    >
      <div className="size-20 shrink-0 overflow-hidden rounded-xl bg-line">
        {cafe.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- small thumbnails, credited on the detail page
          <img src={cafe.coverUrl} alt="" className="size-full object-cover" loading="lazy" />
        ) : (
          <div className="flex size-full items-center justify-center text-2xl text-muted/50" aria-hidden>
            ☕
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-semibold text-ink">
          <Link href={`/cafe/${cafe.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {cafe.name}
          </Link>
        </h3>
        <p className="mt-0.5 text-sm text-muted">
          {[cafe.city, distance != null ? formatDistance(distance) : null, price].filter(Boolean).join(" · ")}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <OpenBadge open={cafe.openNow} />
          {cafe.tags.slice(0, 2).map((slug) => (
            <span key={slug} className="rounded-full bg-ink/5 px-2 py-0.5 text-xs text-ink/70">
              {tagNames.get(slug)?.name ?? slug}
            </span>
          ))}
          {cafe.tags.length > 2 && <span className="text-xs text-muted">+{cafe.tags.length - 2}</span>}
        </div>
      </div>
    </li>
  );
}
