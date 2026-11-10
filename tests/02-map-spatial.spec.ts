import { test, expect } from "@playwright/test";

test.describe("Spatial & MapLibre WebGL QA Suite", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
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
    // Wait for markers to appear
    const markers = page.locator(".maplibregl-marker");
    await expect(markers.first()).toBeVisible({ timeout: 10000 });
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

  test("Clicking a marker opens popup with cafe details", async ({ page }) => {
    // Ensure map is ready and click first marker
    const firstMarker = page.locator(".maplibregl-marker").first();
    await firstMarker.click({ force: true });

    // Verify popup appears
    const popup = page.locator(".maplibregl-popup");
    await expect(popup).toBeVisible({ timeout: 5000 });
    await expect(popup.locator("a[href*='/cafe/']")).toBeVisible();
  });

  test("Hovering or selecting a card highlights corresponding map pin", async ({ page }) => {
    const firstCard = page.locator("li[id^='cafe-']").first();
    await firstCard.hover();

    await page.waitForTimeout(400);
    const hoveredPin = page.locator(".marker-hovered, .maplibregl-marker[style*='z-index: 35']");
    await expect(hoveredPin.first()).toBeAttached();
  });
});
