import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t border-line bg-surface py-12 text-ink">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-line/60">
          <div className="space-y-1">
            <Link
              href="/"
              className="font-display text-lg font-semibold text-espresso tracking-tight hover:opacity-90"
            >
              Brewscout
            </Link>
            <p className="text-xs text-muted max-w-sm">
              An independent, opinionated spatial gazetteer of 50 verified specialty cafés across Cavite, Philippines.
            </p>
          </div>

          <nav aria-label="Footer navigation" className="flex flex-wrap gap-5 text-xs font-semibold text-ink/80">
            <Link href="/explore" className="hover:text-espresso transition-colors">
              Explorer Map
            </Link>
            <a href="#guides" className="hover:text-espresso transition-colors">
              Field Guides
            </a>
            <Link href="/about" className="hover:text-espresso transition-colors">
              About & Methodology
            </Link>
            <a
              href="https://github.com/Hyuga18/Brewscout"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-espresso transition-colors"
            >
              GitHub ↗
            </a>
          </nav>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
          <p>© 2026 Brewscout. Curated by Meinard.</p>
          <p className="text-[11px]">
            Photography remains property of respective cafés under fair attribution.
          </p>
        </div>
      </div>
    </footer>
  );
}
