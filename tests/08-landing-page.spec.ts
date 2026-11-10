import { expect, test } from "@playwright/test";

test.describe("Landing Page & Field Guides Showcase Suite", () => {
  test("Landing page renders editorial masthead and stats banner", async ({ page }) => {
    await page.goto("/");

    // Masthead headline
    const headline = page.locator("h1");
    await expect(headline).toBeVisible();
    await expect(headline).toContainText(/soul of cavite coffee/i);

    // Stats banner
    await expect(page.getByText("50", { exact: true })).toBeVisible();
    await expect(page.getByText("Specialty Cafés", { exact: true })).toBeVisible();
    await expect(page.getByText("12", { exact: true })).toBeVisible();
  });

  test("Primary CTA button links directly to Explorer Map", async ({ page }) => {
    await page.goto("/");

    const explorerCta = page.getByRole("link", { name: /Launch Explorer Map/i }).first();
    await expect(explorerCta).toBeVisible();
    await explorerCta.click();

    await page.waitForURL("**/explore");
    await expect(page.locator("li[id^='cafe-']").first()).toBeVisible({ timeout: 10000 });
  });

  test("Curated Field Guides are showcased and link to pre-filtered Explorer", async ({ page }) => {
    await page.goto("/");

    // Check all 4 routes are visible
    await expect(page.locator("text=Taal Ridge & Sunsets")).toBeVisible();
    await expect(page.locator("text=Secret Garden Sanctuaries")).toBeVisible();
    await expect(page.locator("text=Kapeng Barako Heritage")).toBeVisible();
    await expect(page.locator("text=Late-Night & 24/7 Nooks")).toBeVisible();

    // Click on Taal Ridge route
    const taalRouteBtn = page.locator("a[href*='/explore?guide=taal-ridge']");
    await expect(taalRouteBtn).toBeVisible();
    await taalRouteBtn.click();

    // Verify URL and filtered count
    await page.waitForURL("**/explore?guide=taal-ridge");
    await expect(page.locator("text=/on Taal Ridge & Sunsets/i")).toBeVisible();
    const cards = page.locator("li[id^='cafe-']");
    expect(await cards.count()).toBeGreaterThan(0);
    expect(await cards.count()).toBeLessThan(50); // Filtered!
  });
});
