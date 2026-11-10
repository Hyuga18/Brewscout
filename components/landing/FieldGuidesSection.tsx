import Link from "next/link";
import { FIELD_GUIDES } from "@/lib/field-guides";

export function FieldGuidesSection() {
  return (
    <section id="guides" className="border-b border-line bg-paper py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="max-w-2xl space-y-3">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-espresso tracking-tight">
              Four curated Cavite coffee itineraries.
            </h2>
            <p className="text-base text-ink/75 leading-relaxed">
              Skip generic recommendations. These four routes are engineered for specific moods: from volcanic sunset ridges to quiet botanical garden courtyards.
            </p>
          </div>
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-espresso hover:text-ink transition-colors group shrink-0"
          >
            <span>View all 50 in Explorer</span>
            <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
          </Link>
        </div>

        {/* 4 Field Guide Cards (2x2 Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {FIELD_GUIDES.map((guide) => (
            <article
              key={guide.slug}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-line bg-surface p-6 sm:p-8 transition-all duration-300 hover:border-accent hover:shadow-sm"
            >
              <div>
                {/* Media Stage */}
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-line/60 bg-surface-sub mb-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={guide.coverPhoto}
                    alt={guide.title}
                    className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-ink/80 px-3 py-1 text-xs font-medium text-paper shadow-2xs backdrop-blur-xs">
                    <span aria-hidden="true">{guide.icon}</span>
                    <span>{guide.badge}</span>
                  </div>
                  <div className="absolute bottom-3 right-3 rounded-full bg-paper/90 px-2.5 py-0.5 text-[11px] font-semibold text-espresso shadow-xs backdrop-blur-xs">
                    {guide.cafeSlugs.length} Featured Stops
                  </div>
                </div>

                {/* Typography Stack */}
                <h3 className="font-display text-2xl sm:text-3xl font-semibold text-espresso tracking-tight group-hover:text-ink transition-colors">
                  {guide.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-accent">
                  {guide.tagline}
                </p>
                <p className="mt-3 text-sm text-ink/80 leading-relaxed">
                  {guide.description}
                </p>
              </div>

              {/* Action Link Footer */}
              <div className="mt-8 pt-5 border-t border-line/60 flex items-center justify-between">
                <span className="text-xs text-muted">
                  Pre-filtered map & cards
                </span>
                <Link
                  href={`/explore?guide=${guide.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-espresso/10 hover:bg-espresso px-4 py-2 text-xs font-semibold text-espresso hover:text-paper transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <span>Explore Route</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
