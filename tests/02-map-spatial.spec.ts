import { test, expect } from "@playwright/test";

test.describe("Spatial & MapLibre WebGL QA Suite", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/explore");
    await expect(page.locator("li[id^='cafe-']").first()).toBeVisible({ timeout: 10000 });
  });

  test("Map canvas initializes and mounts properly", async ({ page }) => {
    const mapContainer = page.locator("div[aria-label='Map of cafés']");
    await expect(mapContainer).toBeVisible();

    // MapLibre injects a canvas inside the map container
    const canvas = page.locator(".maplibregl-canvas");
    await expect(canvas).toBeVisible({ timeout: 10000 });
  });

  test("Map markers render for cafes and reflect filter count", async ({ page }) => {
    const markers = page.locator(".maplibregl-marker");
    await expect(markers.first()).toBeAttached({ timeout: 20000 });
    const initialMarkerCount = await markers.count();
    expect(initialMarkerCount).toBeGreaterThan(0);

    // Apply a filter that narrows down cafes
    const pill = page.getByRole("button", { name: "Tagaytay & Silang" });
    await pill.click();

    // Wait for marker count to change/settle
    await page.waitForTimeout(600);
    const filteredMarkerCount = await page.locator(".maplibregl-marker").count();
    expect(filteredMarkerCount).toBeLessThan(initialMarkerCount);
  });

  test("Clicking a marker opens popup, closing it and re-clicking re-opens popup (CRIT-01 fix)", async ({ page }) => {
    // On mobile viewports, switch to map view so drawer collapses and markers are interactive
    const mapSwitcher = page.getByRole("button", { name: "Map" });
    if (await mapSwitcher.isVisible()) {
      await mapSwitcher.click();
      await page.waitForTimeout(400);
    }

    const markers = page.locator(".maplibregl-marker");
    await expect(markers.first()).toBeAttached({ timeout: 20000 });

    const firstMarker = markers.first();
    await firstMarker.click({ force: true }).catch(() => firstMarker.evaluate((el) => (el as HTMLElement).click()));

    // Verify popup appears
    const popup = page.locator(".maplibregl-popup");
    await expect(popup).toBeVisible({ timeout: 10000 });
    await expect(popup.locator("a[href*='/cafe/']")).toBeVisible();

    // Click close button on popup
    const closeBtn = page.locator(".maplibregl-popup-close-button");
    await closeBtn.click();
    await expect(popup).not.toBeVisible();

    // Re-click the same marker
    await firstMarker.click({ force: true }).catch(() => firstMarker.evaluate((el) => (el as HTMLElement).click()));
    await expect(popup).toBeVisible({ timeout: 5000 });
  });

  test("Selecting a card highlights corresponding map pin with marker-selected", async ({ page }) => {
    // Ensure map markers are loaded before selecting
    await expect(page.locator(".maplibregl-marker").first()).toBeAttached({ timeout: 20000 });

    const firstCard = page.locator("li[id^='cafe-']").first();
    // Click corner of card to avoid inner Link navigation
    await firstCard.click({ position: { x: 8, y: 8 } });

    const selectedPin = page.locator(".marker-selected, .maplibregl-marker[style*='z-index: 40']");
    await expect(selectedPin.first()).toBeAttached({ timeout: 10000 });
  });
});
