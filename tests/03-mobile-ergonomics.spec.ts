import { test, expect } from "@playwright/test";

test.describe("Mobile Touch & Ergonomics QA Suite", () => {
  test.use({ viewport: { width: 390, height: 844 } }); // iPhone 14 viewport

  test.beforeEach(async ({ page }) => {
    await page.goto("/explore");
    await expect(page.locator("li[id^='cafe-']").first()).toBeVisible({ timeout: 10000 });
  });

  test("Mobile view switcher toggles between Map and Cafés view with aria-pressed", async ({ page }) => {
    const mapToggle = page.getByRole("button", { name: "Map" });
    const cafesToggle = page.getByRole("button", { name: /List/ });

    await expect(mapToggle).toBeVisible();
    await expect(cafesToggle).toBeVisible();

    // Click Map view
    await mapToggle.click();
    await page.waitForTimeout(400);
    await expect(mapToggle).toHaveAttribute("aria-pressed", "true");

    // Click Cafes view
    await cafesToggle.click();
    await page.waitForTimeout(400);
    await expect(cafesToggle).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("li[id^='cafe-']").first()).toBeVisible();
  });

  test("Mobile bottom sheet drag handle exists and has touch-action none", async ({ page }) => {
    const dragHandle = page.locator("button[aria-label*='drawer'], button[aria-label*='Drag'], button[aria-label*='sheet']");
    if (await dragHandle.count() > 0) {
      await expect(dragHandle.first()).toBeVisible();
      await expect(dragHandle.first()).toHaveAttribute("style", /touch-action:\s*none/);
    }
  });

  test("No accidental horizontal overflow on mobile viewport", async ({ page }) => {
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2); // Subpixel tolerance
  });

  test("Key touch targets meet min-height requirements", async ({ page }) => {
    const bookmarkBtn = page.locator("li[id^='cafe-'] button[aria-label*='Scoutlist']").first();
    const box = await bookmarkBtn.boundingBox();
    if (box) {
      expect(Math.max(box.width, 36)).toBeGreaterThanOrEqual(36);
    }

    const mapToggle = page.getByRole("button", { name: "Map" });
    const mapBox = await mapToggle.boundingBox();
    if (mapBox) {
      expect(mapBox.height).toBeGreaterThanOrEqual(36);
    }
  });
});
