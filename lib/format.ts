export const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function formatPrice(min: number | null, max: number | null): string | null {
  if (min == null && max == null) return null;
  if (min == null || max == null || min === max) return `₱${min ?? max}`;
  return `₱${min}–${max}`;
}

/** "16:30:00" -> "4:30 PM" */
export function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const suffix = h < 12 ? "AM" : "PM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m ? `${hour}:${String(m).padStart(2, "0")} ${suffix}` : `${hour} ${suffix}`;
}

/** Day of week (0 = Sunday) in Asia/Manila. */
export function manilaDayOfWeek(date = new Date()): number {
  const day = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Manila", weekday: "short" }).format(date);
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(day);
}

export type CafeHour = {
  day_of_week: number;
  opens: string;
  closes: string;
};

export function computeIsOpenNow(
  hours: CafeHour[],
  is24h: boolean,
  atDate: Date = new Date(),
): boolean {
  if (is24h) return true;
  if (!hours || hours.length === 0) return false;

  const dow = manilaDayOfWeek(atDate);
  const yesterdayDow = (dow + 6) % 7;

  const t = atDate.toLocaleTimeString("en-US", {
    timeZone: "Asia/Manila",
    hourCycle: "h23",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return hours.some((h) => {
    // Window started today
    if (h.day_of_week === dow) {
      if (h.opens < h.closes && t >= h.opens && t < h.closes) {
        return true;
      }
      if (h.closes < h.opens && t >= h.opens) {
        return true;
      }
    }
    // Window started yesterday and runs past midnight
    if (h.day_of_week === yesterdayDow && h.closes < h.opens && t < h.closes) {
      return true;
    }
    return false;
  });
}
