import Link from "next/link";

const TICKER_CAFES = [
  { slug: "ruined-project-tagaytay", name: "Ruined Project", city: "Tagaytay", tag: "Overgrown Botanical Alpine" },
  { slug: "cafe-agapita-silang", name: "Cafe Agapita", city: "Silang", tag: "Heritage Garden" },
  { slug: "tinatangi-cafe", name: "Tinatangi Café", city: "Dasmariñas", tag: "Modern Study Loft" },
  { slug: "bag-of-beans", name: "Bag of Beans", city: "Tagaytay", tag: "Iconic Rustic Estate" },
  { slug: "cafe-10-23", name: "Cafe 10/23", city: "Imus", tag: "Pastel Industrial" },
  { slug: "hiwaga-cafe-kawit", name: "Hiwaga Cafe", city: "Kawit", tag: "Acoustic Night Roastery" },
  { slug: "kura-cafe", name: "Kura Cafe", city: "General Trias", tag: "Cozy Plant Haven" },
  { slug: "cafe-amadeo-amadeo", name: "Cafe Amadeo", city: "Amadeo", tag: "Pahimis Coffee Capital" },
];

export function CuratedGalleryTicker() {
  return (
    <section className="border-b border-line bg-paper py-16 sm:py-20 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 mb-8 flex items-baseline justify-between">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-espresso tracking-tight">
            Real atmospheres, verified in person.
          </h2>
        </div>
        <Link
          href="/explore"
          className="text-xs sm:text-sm font-semibold text-espresso hover:text-ink transition-colors"
        >
          Explore map →
        </Link>
      </div>

      {/* Horizontal Carousel */}
      <div className="flex gap-4 overflow-x-auto px-4 sm:px-6 pb-4 [scrollbar-width:none]">
        {TICKER_CAFES.map((item) => (
          <Link
            key={item.slug}
            href={`/cafe/${item.slug}`}
            className="group relative flex-none w-64 sm:w-72 overflow-hidden rounded-2xl border border-line bg-surface transition-all duration-300 hover:border-accent hover:shadow-sm"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-sub">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/cafes/${item.slug}/cover.jpg`}
                alt={item.name}
                className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute top-2 left-2 rounded-full bg-ink/75 px-2.5 py-0.5 text-[10px] font-medium text-paper backdrop-blur-xs">
                {item.tag}
              </div>
            </div>
            <div className="p-3.5">
              <h3 className="font-display text-base font-semibold text-espresso group-hover:text-ink transition-colors truncate">
                {item.name}
              </h3>
              <p className="text-xs text-muted mt-0.5">{item.city}, Cavite</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
