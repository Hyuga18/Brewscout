export function StatsBanner() {
  const stats = [
    { number: "50", label: "Specialty Cafés", sub: "100% verified independent" },
    { number: "12", label: "Cavite Towns", sub: "Tagaytay to Amadeo" },
    { number: "₱100–180", label: "Latte Range", sub: "Transparent entry prices" },
    { number: "24/7", label: "Night Routes", sub: "Evaluated in Manila time" },
  ];

  return (
    <section className="border-b border-line bg-surface py-10 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col space-y-1">
              <span className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-espresso tracking-tight tabular-nums">
                {stat.number}
              </span>
              <span className="text-sm font-semibold text-ink">{stat.label}</span>
              <span className="text-xs text-muted">{stat.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
