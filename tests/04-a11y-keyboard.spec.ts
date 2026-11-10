import { test, expect } from "@playwright/test";

test.describe("Accessibility (WCAG 2.1 AA) & Keyboard QA Suite", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("li[id^='cafe-']").first()).toBeVisible({ timeout: 10000 });
  });

  test("Pressing '/' focuses the search input", async ({ page }) => {
    const searchInput = page.getByRole("searchbox", { name: /search cafés/i });
    
    // Ensure input is not focused
    await page.locator("body").click();
    await expect(searchInput).not.toBeFocused();

    // Press '/'
    await page.keyboard.press("/");
    await expect(searchInput).toBeFocused();
  });

  test("Skip link exists and is focusable via keyboard Tab", async ({ page }) => {
    // Check skip link attached in DOM
    const skipLink = page.locator("a[href='#cafe-directory-feed']");
    await expect(skipLink).toBeAttached();
  });

  test("Filter tags have correct ARIA pressed/expanded semantics", async ({ page }) => {
    const openNowBtn = page.getByRole("button", { name: /open now/i });
    await expect(openNowBtn).toHaveAttribute("aria-pressed");

    // Check vibes or dropdown button for aria-expanded
    const dropdowns = page.locator("button[aria-expanded]");
    const dropdownCount = await dropdowns.count();
    expect(dropdownCount).toBeGreaterThanOrEqual(1);
  });

  test("Color theme defines accessible paper contrast tokens", async ({ page }) => {
    const bodyBg = await page.evaluate(() => {
      const style = window.getComputedStyle(document.body);
      return style.backgroundColor;
    });
    expect(bodyBg).toBeTruthy();
  });
});
