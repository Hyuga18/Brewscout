import type { Metadata } from "next";
import Link from "next/link";
import { BackButton } from "@/components/BackButton";

export const metadata: Metadata = {
  title: "Field Guide & Terroir Atlas · Brewscout",
  description:
    "The curatorial manifesto, Cavite coffee heritage, and human verification standards behind the Brewscout coffee gazetteer.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
      <div className="pb-4">
        <BackButton label="Back to Explorer" />
      </div>

      <article className="mt-4 space-y-12">
        {/* Curatorial Masthead */}
        <header className="space-y-4">
          <h1 className="font-display text-4xl sm:text-6xl font-semibold text-espresso tracking-tight leading-[1.08] text-balance">
            Mapping the Specialty Coffee Frontier of Cavite.
          </h1>
          <p className="text-base sm:text-xl leading-relaxed text-ink/85 max-w-2xl font-normal">
            Brewscout is an independent, opinionated spatial gazetteer chronicling the third-wave
            roasters, heritage farms, and work-friendly havens across Cavite, Philippines.
          </p>
        </header>

        {/* Verification Statistics Plaques */}
        <section aria-labelledby="stats-heading" className="border-y border-line py-8">
          <h2 id="stats-heading" className="sr-only">
            Brewscout Verification Standards
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-line bg-surface p-5 shadow-2xs">
              <span className="font-display text-3xl sm:text-4xl font-bold text-espresso tabular-nums">
                50
              </span>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-accent">
                Hand-Verified Cafés
              </p>
              <p className="mt-1.5 text-xs text-muted leading-relaxed">
                Zero automated scrapers. Individually audited for operating schedules, Wi-Fi, and latte prices.
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-surface p-5 shadow-2xs">
              <span className="font-display text-3xl sm:text-4xl font-bold text-espresso tabular-nums">
                12
              </span>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-accent">
                Cavite Municipalities
              </p>
              <p className="mt-1.5 text-xs text-muted leading-relaxed">
                Spanning the Tagaytay Ridge, upland Silang, Amadeo heartland, and coastal roasteries.
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-surface p-5 shadow-2xs">
              <span className="font-display text-3xl sm:text-4xl font-bold text-espresso tabular-nums">
                100%
              </span>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-accent">
                Zero-Paid Placement
              </p>
              <p className="mt-1.5 text-xs text-muted leading-relaxed">
                Unbiased field curation based solely on roast craft, spatial atmosphere, and utility.
              </p>
            </div>
          </div>
        </section>

        {/* The Problem: What Mainstream Maps Miss */}
        <section className="space-y-4">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-espresso">
            What Mainstream Maps Leave Unstructured
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-ink/85">
            Mainstream map applications reduce cafés to star ratings and commercial franchise banners.
            When remote workers, roasters, or road-trippers seek a destination in Cavite, they need
            structured answers to four fundamental questions:
          </p>

          <div className="grid gap-3.5 sm:grid-cols-2 pt-2">
            <div className="flex flex-col justify-between rounded-2xl border border-line bg-surface p-4 shadow-2xs">
              <div className="flex items-center gap-2 mb-1.5">
                <svg className="size-4 text-espresso" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                <h3 className="font-semibold text-ink text-sm">Work Infrastructure</h3>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Verified power outlet availability, laptop-friendly work tables, and dependable Wi-Fi
                connections calibrated for remote work sessions.
              </p>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-line bg-surface p-4 shadow-2xs">
              <div className="flex items-center gap-2 mb-1.5">
                <svg className="size-4 text-espresso" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
                <h3 className="font-semibold text-ink text-sm">True Midnight Windows</h3>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Evaluated in real-time Philippine Standard Time (PST), identifying 24/7 roadtrip stops and
                evening sanctuaries open past 10 PM.
              </p>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-line bg-surface p-4 shadow-2xs">
              <div className="flex items-center gap-2 mb-1.5">
                <svg className="size-4 text-espresso" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                </svg>
                <h3 className="font-semibold text-ink text-sm">Latte Price Benchmarks</h3>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Standardized latte price bands in Philippine Pesos (₱) to evaluate specialty pricing
                tiers before arriving.
              </p>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-line bg-surface p-4 shadow-2xs">
              <div className="flex items-center gap-2 mb-1.5">
                <svg className="size-4 text-espresso" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                </svg>
                <h3 className="font-semibold text-ink text-sm">Spatial Atmosphere</h3>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Classified by architectural environment: panoramic volcanic ridge caldera views,
                secluded garden glasshouses, or quiet urban study lofts.
              </p>
            </div>
          </div>
        </section>

        {/* Cavite 3-Zone Coffee Atlas */}
        <section className="space-y-4 border-t border-line pt-8">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-espresso">
            The Cavite 3-Zone Coffee Atlas
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-ink/85">
            Cavite holds a foundational place in Philippine coffee history. The province is divided into
            three distinct coffee micro-regions:
          </p>

          <div className="space-y-3 pt-2">
            <div className="rounded-2xl border border-line bg-surface p-5 shadow-2xs space-y-1.5">
              <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[11px] font-semibold text-espresso uppercase tracking-wider">
                Zone 01 · The Ridge Caldera
              </span>
              <h3 className="font-display text-lg font-semibold text-ink">Tagaytay & Silang Uplands</h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                Perched along the rim of Taal Volcano, this cool microclimate is home to architectural
                glasshouses, lush garden hideaways, and scenic ridge roasteries designed for slow afternoons
                and misty morning drives.
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-surface p-5 shadow-2xs space-y-1.5">
              <span className="rounded-full bg-espresso/15 px-2.5 py-0.5 text-[11px] font-semibold text-espresso uppercase tracking-wider">
                Zone 02 · The Heritage Heartland
              </span>
              <h3 className="font-display text-lg font-semibold text-ink">Amadeo, Alfonso & Indang</h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                Known as the Coffee Capital of the Philippines, Amadeo and its neighboring agrarian towns
                are the heart of Philippine <em>Kapeng Barako</em> (Liberica) and Robusta cultivation, celebrated
                each year at the historic <em>Pahimis Festival</em>.
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-surface p-5 shadow-2xs space-y-1.5">
              <span className="rounded-full border border-line bg-surface-sub px-2.5 py-0.5 text-[11px] font-semibold text-ink-sub uppercase tracking-wider">
                Zone 03 · The Urban Specialty Labs
              </span>
              <h3 className="font-display text-lg font-semibold text-ink">Dasmariñas, Imus & Gen. Trias</h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                Dynamic, fast-paced micro-roasteries and student workspace lofts near university clusters
                and suburban hubs, pioneering calibrated espresso extraction and modern single-origin beans.
              </p>
            </div>
          </div>
        </section>

        {/* Built for Craft Call to Action */}
        <section className="space-y-4 border-t border-line pt-8">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-espresso">
            Engineered for Speed & Precision
          </h2>
          <p className="text-sm leading-relaxed text-muted">
            Brewscout is built with Next.js 16 (App Router with Cache Components), React 19, Supabase
            PostGIS spatial indexing, MapLibre GL with OpenFreeMap vector tiles, and Tailwind CSS v4.
            Progressive Web App (PWA) enabled.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-espresso px-5 py-2.5 text-sm font-semibold text-paper shadow-xs hover:bg-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span>Explore the Gazetteer</span>
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
            <a
              href="https://github.com/Hyuga18/Brewscout"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-semibold text-ink hover:border-ink/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              <span>GitHub</span>
            </a>
          </div>
        </section>
      </article>
    </div>
  );
}
