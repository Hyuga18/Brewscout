import Link from "next/link";

export function LandingCta() {
  return (
    <section className="relative overflow-hidden bg-espresso py-16 sm:py-24 text-paper">
      {/* Subtle Warm Amber Gradient Accent */}
      <div
        className="pointer-events-none absolute -bottom-10 right-0 size-96 rounded-full bg-accent/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center space-y-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-paper/10 px-3 py-1 text-xs font-semibold tracking-wide text-paper/90">
          <span>Ready to explore?</span>
        </span>

        <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-paper text-balance leading-tight">
          Find your next favorite table in Cavite.
        </h2>

        <p className="mx-auto max-w-xl text-base sm:text-lg text-paper/80 font-normal leading-relaxed text-pretty">
          Whether you need a midnight pour-over overlooking Taal Lake or a quiet garden sanctuary to finish your work, the gazetteer is ready.
        </p>

        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <Link
            href="/explore"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-accent hover:bg-accent/90 px-7 py-3.5 text-sm sm:text-base font-semibold text-paper shadow-md transition-all active:scale-98 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper"
          >
            <span>Launch Spatial Explorer</span>
            <span aria-hidden="true">→</span>
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-paper/30 hover:border-paper bg-transparent px-5 py-3.5 text-sm sm:text-base font-medium text-paper transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper"
          >
            <span>About Brewscout</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
