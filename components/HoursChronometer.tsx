import type { CafeDetail } from "@/lib/cafes";
import { DAY_NAMES, formatTime, manilaDayOfWeek } from "@/lib/format";

export function HoursChronometer({ cafe }: { cafe: CafeDetail }) {
  if (cafe.is24h) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-5 shadow-2xs">
        <div className="flex items-center gap-2.5 text-open font-semibold text-sm">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-open opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full bg-open" />
          </span>
          <span>Open 24 Hours, 7 Days a Week</span>
        </div>
        <p className="mt-1.5 text-xs text-muted leading-relaxed">
          Welcomes midnight drives, night-shift coders, and sunrise road-trippers across Cavite.
        </p>
      </div>
    );
  }

  if (cafe.hours.length === 0) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-5 text-sm text-muted shadow-2xs">
        Operating hours are currently being verified by the Scout team.
      </div>
    );
  }

  const today = manilaDayOfWeek();
  const todayHours = cafe.hours.filter((h) => h.dayOfWeek === today);

  return (
    <div className="space-y-4 rounded-2xl border border-line bg-surface p-5 shadow-2xs">
      {/* Today's Highlighted Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line/60 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              Today ({DAY_NAMES[today]})
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                cafe.openNow ? "bg-[#edf7f1] text-open" : "bg-ink/5 text-muted"
              }`}
            >
              <span className={`size-1.5 rounded-full ${cafe.openNow ? "bg-open" : "bg-muted/60"}`} />
              {cafe.openNow ? "Open Now" : "Currently Closed"}
            </span>
          </div>
          <div className="mt-1 text-base font-semibold text-ink tabular-nums">
            {todayHours.length > 0
              ? todayHours
                  .map((w) => {
                    const isOvernight = w.closes < w.opens;
                    return `${formatTime(w.opens)} – ${formatTime(w.closes)}${
                      isOvernight ? " (+1 day)" : ""
                    }`;
                  })
                  .join(", ")
              : "Closed Today"}
          </div>
        </div>
      </div>

      {/* Daylight Timeline Visualization for Today */}
      {todayHours.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-[10px] font-medium text-muted uppercase tracking-wider">
            <span>6 AM</span>
            <span>12 PM (Noon)</span>
            <span>6 PM</span>
            <span>Midnight</span>
          </div>
          {/* Timeline Track */}
          <div className="relative h-2 w-full rounded-full bg-line/60 overflow-hidden">
            {todayHours.map((w, idx) => {
              const [openH, openM] = w.opens.split(":").map(Number);
              const [closeH, closeM] = w.closes.split(":").map(Number);
              const startMin = openH * 60 + openM;
              const rawEndMin = closeH * 60 + closeM;
              const endMin = rawEndMin < startMin ? rawEndMin + 1440 : rawEndMin;
              const leftPct = Math.max(0, Math.min(100, (startMin / 1440) * 100));
              const widthPct = Math.max(
                4,
                Math.min(100 - leftPct, ((endMin - startMin) / 1440) * 100),
              );

              return (
                <div
                  key={idx}
                  style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                  className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-accent to-espresso"
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Complete 7-Day Schedule Grid */}
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 pt-2 text-xs">
        {DAY_NAMES.map((day, idx) => {
          const windows = cafe.hours.filter((h) => h.dayOfWeek === idx);
          const isToday = idx === today;
          return (
            <div
              key={day}
              className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 transition-colors ${
                isToday
                  ? "bg-accent/10 font-semibold text-espresso"
                  : "text-ink/80 hover:bg-surface-sub"
              }`}
            >
              <span className="flex items-center gap-1.5">
                {isToday && <span className="size-1.5 rounded-full bg-accent" />}
                <span>{day}</span>
              </span>
              <span className="tabular-nums text-muted font-medium">
                {windows.length > 0
                  ? windows
                      .map((w) => {
                        const isOvernight = w.closes < w.opens;
                        return `${formatTime(w.opens)}–${formatTime(w.closes)}${
                          isOvernight ? "*" : ""
                        }`;
                      })
                      .join(", ")
                  : "Closed"}
              </span>
            </div>
          );
        })}
      </dl>
      <div className="pt-1 text-[11px] text-muted font-medium">
        * Windows ending after midnight continue into the following morning. All hours in Asia/Manila (PST).
      </div>
    </div>
  );
}
