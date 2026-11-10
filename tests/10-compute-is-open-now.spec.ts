import { test, expect } from "@playwright/test";
import { computeIsOpenNow } from "@/lib/format";

test.describe("computeIsOpenNow Pure Logic Unit Test Suite", () => {
  test("24/7 venues always return true regardless of hours", () => {
    expect(computeIsOpenNow([], true)).toBe(true);
    expect(computeIsOpenNow([{ day_of_week: 1, opens: "08:00:00", closes: "17:00:00" }], true)).toBe(true);
  });

  test("Empty hours array returns false for non-24h venue", () => {
    expect(computeIsOpenNow([], false)).toBe(false);
  });

  test("Standard daytime shift (08:00 to 20:00 on Monday)", () => {
    const mondayHours = [{ day_of_week: 1, opens: "08:00:00", closes: "20:00:00" }];
    
    // Monday at 12:00 PM Manila time (2026-11-09 is a Monday)
    const midDay = new Date("2026-11-09T04:00:00.000Z"); // 04:00 UTC = 12:00 PM Manila
    expect(computeIsOpenNow(mondayHours, false, midDay)).toBe(true);

    // Monday before open at 07:00 AM Manila time
    const beforeOpen = new Date("2026-11-08T23:00:00.000Z"); // 23:00 UTC = 07:00 AM Manila
    expect(computeIsOpenNow(mondayHours, false, beforeOpen)).toBe(false);

    // Monday after close at 21:00 PM Manila time
    const afterClose = new Date("2026-11-09T13:00:00.000Z"); // 13:00 UTC = 21:00 PM Manila
    expect(computeIsOpenNow(mondayHours, false, afterClose)).toBe(false);

    // Tuesday at 12:00 PM Manila time (different day)
    const tuesday = new Date("2026-11-10T04:00:00.000Z");
    expect(computeIsOpenNow(mondayHours, false, tuesday)).toBe(false);
  });

  test("Overnight window past midnight (Friday 18:00 to Saturday 02:00)", () => {
    // Friday (day_of_week = 5) opens 18:00, closes 02:00 (past midnight)
    const overnightHours = [{ day_of_week: 5, opens: "18:00:00", closes: "02:00:00" }];

    // Friday 23:00 PM Manila time (2026-11-13 is Friday)
    const fridayNight = new Date("2026-11-13T15:00:00.000Z"); // 15:00 UTC = 23:00 Manila
    expect(computeIsOpenNow(overnightHours, false, fridayNight)).toBe(true);

    // Saturday 01:30 AM Manila time (spillover from Friday night)
    const saturdayEarlyMorning = new Date("2026-11-13T17:30:00.000Z"); // 17:30 UTC = 01:30 Sat Manila
    expect(computeIsOpenNow(overnightHours, false, saturdayEarlyMorning)).toBe(true);

    // Saturday 02:30 AM Manila time (after closing)
    const saturdayAfterClose = new Date("2026-11-13T18:30:00.000Z"); // 18:30 UTC = 02:30 Sat Manila
    expect(computeIsOpenNow(overnightHours, false, saturdayAfterClose)).toBe(false);
  });
});
