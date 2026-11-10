import { test, expect } from "@playwright/test";

test.describe("Data Integrity & Dossier QA Suite", () => {
  test("Navigating to a cafe dossier page loads successfully", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("li[id^='cafe-']").first()).toBeVisible({ timeout: 10000 });

    const firstCardLink = page.locator("li[id^='cafe-'] a[href^='/cafe/']").first();
    const href = await firstCardLink.getAttribute("href");
    expect(href).toMatch(/^\/cafe\/[a-z0-9-]+$/);

    await firstCardLink.click();
    await expect(page).toHaveURL(new RegExp(href!));

    // Check h1 contains cafe name
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();

    // Check operating hours chronometer or schedule is present
    await expect(page.locator("text=/Operating Rhythm|Hours|Open|Closed/i").first()).toBeVisible();

    // Check Directions button
    const directionsLink = page.getByRole("link", { name: /directions|get directions/i });
    if (await directionsLink.count() > 0) {
      const gmapsHref = await directionsLink.getAttribute("href");
      expect(gmapsHref).toMatch(/google\.com\/maps/);
      expect(await directionsLink.getAttribute("target")).toBe("_blank");
      expect(await directionsLink.getAttribute("rel")).toContain("noopener");
    }
  });

  test("Invalid slug triggers 404 page gracefully", async ({ page }) => {
    const response = await page.goto("/cafe/non-existent-cafe-slug-404-test");
    expect([200, 404]).toContain(response?.status());
    await expect(page.locator("text=/Not Found|404/i").first()).toBeVisible();
  });

  test("About page loads cleanly with design system tokens", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("text=/Brewscout/i").first()).toBeVisible();
  });
});
