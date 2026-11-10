import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Brewscout · Cavite Specialty Coffee Guide",
  description:
    "Why Brewscout exists, how 50 independent cafés across Cavite are verified, and the heritage behind Cavite coffee culture.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors"
      >
        <svg
          className="size-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        <span>Back to Explorer</span>
      </Link>

      <article className="mt-6 space-y-10">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl sm:text-5xl text-espresso tracking-tight">
            Mapping Cavite’s Coffee Frontier.
          </h1>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-ink/80">
            Brewscout is an independent, opinionated directory and spatial guide to the best
            third-wave, specialty, and homegrown cafés across the province of Cavite, Philippines.
          </p>
        </div>

        {/* Section 1: The Problem */}
        <section className="space-y-3 border-t border-line pt-8">
          <h2 className="font-display text-2xl text-espresso">
            What Google Maps Leaves Out
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-ink/80">
            When you are looking for a place to work, read, or enjoy an intentional cup of coffee,
            Google Maps and food apps give you star ratings and sponsored commercial chains. They
            rarely tell you what matters:
          </p>
          <ul className="grid gap-2.5 pt-2 text-sm text-ink/80 sm:grid-cols-2">
            <li className="flex items-start gap-2.5 rounded-xl border border-line bg-surface p-3">
              <span className="text-accent font-semibold">⚡</span>
              <div>
                <strong className="text-ink font-medium">Work-Friendliness:</strong> Verified power
                outlets, laptop-friendly tables, and reliable fast Wi-Fi.
              </div>
            </li>
            <li className="flex items-start gap-2.5 rounded-xl border border-line bg-surface p-3">
              <span className="text-accent font-semibold">🌙</span>
              <div>
                <strong className="text-ink font-medium">True Night Hours:</strong> Cafés that stay
                open past 10 PM or run 24/7 for night owls and road-trippers.
              </div>
            </li>
            <li className="flex items-start gap-2.5 rounded-xl border border-line bg-surface p-3">
              <span className="text-accent font-semibold">☕</span>
              <div>
                <strong className="text-ink font-medium">Latte Price Benchmarks:</strong> Realistic
                entry and specialty price bands in Philippine Pesos.
              </div>
            </li>
            <li className="flex items-start gap-2.5 rounded-xl border border-line bg-surface p-3">
              <span className="text-accent font-semibold">🌿</span>
              <div>
                <strong className="text-ink font-medium">Architectural Vibe:</strong> Ridge caldera
                views, lush garden hideaways, cozy lofts, or brutalist glasshouses.
              </div>
            </li>
          </ul>
        </section>

        {/* Section 2: Cavite's Heritage */}
        <section className="space-y-3 border-t border-line pt-8">
          <h2 className="font-display text-2xl text-espresso">
            Cavite’s Coffee Heritage
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-ink/80">
            Cavite holds a foundational place in Philippine coffee history. From the heritage Liberica
            (<em>Kapeng Barako</em>) and Robusta farms of Amadeo—celebrated each year at the Pahimis
            Festival—to the cool volcanic soil of Silang and the Tagaytay Ridge, coffee is woven into
            the province’s identity.
          </p>
          <p className="text-sm sm:text-base leading-relaxed text-ink/80">
            In recent years, a vibrant wave of independent roasters, specialty micro-cafés, and
            architect-designed spaces have emerged in urban hubs like Dasmariñas, Imus, and General
            Trias, alongside scenic destination spots in Silang, Tagaytay, and Alfonso. Brewscout
            chronicles this homegrown specialty movement.
          </p>
        </section>

        {/* Section 3: Verification Standard */}
        <section className="space-y-3 border-t border-line pt-8">
          <h2 className="font-display text-2xl text-espresso">
            Human-Verified Standard
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-ink/80">
            Every café in Brewscout’s verified directory has been individually audited against real
            operating schedules, menu photos, and spatial coordinates. We do not use automated
            scraping or commercial place scrapers:
          </p>
          <div className="rounded-2xl border border-line bg-surface p-5 text-sm text-ink/80 space-y-2">
            <p>
              📍 <strong>50 Hand-Verified Specialty Cafés</strong> across 12 Cavite LGUs: Tagaytay,
              Silang, Dasmariñas, General Trias, Imus, Bacoor, Kawit, Cavite City, Amadeo, Tanza,
              Indang, and Ternate.
            </p>
            <p>
              🕒 <strong>Manila Timezone Window Validation:</strong> Operating hours are checked
              against midnight-crossing windows and Philippine standard time.
            </p>
            <p>
              📷 <strong>Ethical Photo Credits:</strong> All cafe photography originates from the
              cafés’ public feeds with direct attribution and links to their official pages.
            </p>
          </div>
        </section>

        {/* Section 4: Architecture & Open Source */}
        <section className="space-y-3 border-t border-line pt-8">
          <h2 className="font-display text-2xl text-espresso">
            Built for Speed and Craft
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-ink/80">
            Brewscout is a portfolio project built with modern, zero-telemetry web standards:
          </p>
          <p className="text-sm text-muted">
            Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · MapLibre GL with OpenFreeMap vector
            tiles · Supabase PostGIS spatial queries · Progressive Web App (PWA).
          </p>
          <div className="pt-4 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2 text-sm font-medium text-surface hover:bg-espresso transition-colors"
            >
              <span>Explore the Cafés</span>
              <svg
                className="size-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
            <a
              href="https://github.com/Hyuga18/Brewscout"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-5 py-2 text-sm font-medium text-ink hover:border-ink/40 transition-colors"
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
