export function FeaturePillars() {
  const pillars = [
    {
      id: "work",
      title: "Work intel that tells the truth",
      description:
        "Every entry verifies fast Wi-Fi, accessible outlets, and seating policies so you never get turned away with a dead laptop.",
    },
    {
      id: "price",
      title: "Honest latte prices, not dollar signs",
      description:
        "We track the exact price for a standard espresso latte across every café (typically ₱100–₱180). Zero menu surprises after an hour's drive.",
    },
    {
      id: "hours",
      title: "Open-now that knows about 2 AM closings",
      description:
        "Hours are evaluated in real-time in Manila timezone (Asia/Manila), accurately handling midnight and 2 AM closing shifts.",
    },
    {
      id: "gps",
      title: "Pins on the actual door, not the highway",
      description:
        "Exact verified entrance coordinates, not vague highway markers. Integrated one-tap launch for Google Maps, Waze, and Apple Maps.",
    },
  ];

  return (
    <section className="border-b border-line bg-surface py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl mb-12 space-y-3">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-espresso tracking-tight">
            Built for what map apps leave out.
          </h2>
          <p className="text-base text-ink/75 leading-relaxed">
            Mainstream map platforms are built for generic navigation and sponsored ads. Brewscout is hand-crafted specifically for specialty coffee lovers and remote workers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="flex flex-col justify-between rounded-2xl border border-line bg-paper p-6 shadow-2xs hover:border-accent/60 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  {pillar.id === "work" && (
                    <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  )}
                  {pillar.id === "price" && (
                    <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
                      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
                      <line x1="6" y1="2" x2="6" y2="4" />
                      <line x1="10" y1="2" x2="10" y2="4" />
                      <line x1="14" y1="2" x2="14" y2="4" />
                    </svg>
                  )}
                  {pillar.id === "hours" && (
                    <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  )}
                  {pillar.id === "gps" && (
                    <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  )}
                </div>
                <h3 className="font-display text-lg font-semibold text-espresso">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-ink/75 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
