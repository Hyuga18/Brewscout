import Link from "next/link";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-paper pt-12 pb-16 sm:pt-20 sm:pb-24">
      {/* Background Accent Subtle Glow */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-accent/5 blur-3xl"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Editorial Copy (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-espresso shadow-2xs">
              <span className="size-2 rounded-full bg-accent animate-pulse" aria-hidden="true" />
              <span>Cavite Coffee Gazetteer · 2026 Edition</span>
            </div>

            {/* Display Headline */}
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-semibold text-espresso tracking-tight leading-[1.08] text-balance">
              The soul of Cavite coffee, curated.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-ink/80 leading-relaxed max-w-2xl text-pretty font-normal">
              50 independent third-wave roasteries, secret garden courtyards, and 24/7 mountain ridge espresso stops. Filtered by the structured criteria mainstream map apps leave out.
            </p>

            {/* Action Group */}
            <div className="flex flex-wrap items-center gap-3 pt-2 w-full sm:w-auto">
              <Link
                href="/explore"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full bg-espresso px-6 py-3.5 text-sm sm:text-base font-semibold text-paper shadow-xs hover:bg-ink hover:shadow-md transition-all active:scale-98 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <span>Launch Explorer Map</span>
                <span aria-hidden="true">→</span>
              </Link>
              <a
                href="#guides"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-line bg-surface px-5 py-3.5 text-sm sm:text-base font-medium text-ink hover:border-ink/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <span>Browse Field Guides</span>
                <span aria-hidden="true">↓</span>
              </a>
            </div>

            {/* Trust Badges Row */}
            <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-muted border-t border-line/60 w-full">
              <div className="flex items-center gap-1.5">
                <svg className="size-3.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>50 Hand-Inspected Venues</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="size-3.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Independent Specialty Focus</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="size-3.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Genuine Photographer Credits</span>
              </div>
            </div>
          </div>

          {/* Right Visual Composition: Overlapping Curated Dossier Cards (5 cols) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Background Accent Card */}
            <div className="relative w-full max-w-sm sm:max-w-md aspect-[4/5] rounded-3xl p-3 border border-line/80 bg-surface shadow-xs rotate-1 sm:rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="relative size-full overflow-hidden rounded-2xl border border-line/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/cafes/cafe-agapita-silang/cover.jpg"
                  alt="Cafe Agapita lush botanical courtyard in Silang"
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
                
                {/* Floating Intel Overlay */}
                <div className="absolute bottom-4 left-4 right-4 text-paper space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-medium tracking-wide">
                    <span className="rounded-full bg-accent/80 px-2 py-0.5 text-paper">Silang Sanctuaries</span>
                    <span className="bg-open/90 text-paper font-semibold px-2 py-0.5 rounded-full">Open Now</span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-paper">
                    Cafe Agapita
                  </h3>
                  <p className="text-xs text-paper/85 line-clamp-1">
                    Botanical garden estate · Standard latte ₱160
                  </p>
                </div>
              </div>

              {/* Overlapping Floating Badge */}
              <div className="absolute -bottom-4 -left-3 sm:-left-6 rounded-2xl border border-line bg-surface p-3.5 shadow-md flex items-center gap-3">
                <div className="size-10 rounded-xl bg-accent/15 flex items-center justify-center text-xl">
                  🌋
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-muted uppercase tracking-wider">Taal Ridge Route</div>
                  <div className="text-xs font-semibold text-espresso">Taal Caldera & Sunsets</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
