import { test, expect } from "@playwright/test";

test.describe("Functional & Exploratory QA - Filter & Search Suite", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("li[id^='cafe-']").first()).toBeVisible({ timeout: 10000 });
  });

  test("Initial page load displays 50 verified cafes in Cavite", async ({ page }) => {
    const countHeading = page.locator("text=/\\d+ cafés in Cavite/i");
    await expect(countHeading).toBeVisible();
    await expect(countHeading).toContainText("50 cafés in Cavite");
    const cards = page.locator("li[id^='cafe-']");
    await expect(cards).toHaveCount(50);
  });

  test("Search filters by name case-insensitively", async ({ page }) => {
    const searchInput = page.getByRole("searchbox", { name: /search cafés/i });
    await searchInput.fill("Koffie");
    
    // Expect 16th Cent Koffie to match
    await expect(page.getByRole("heading", { name: "16th Cent Koffie" })).toBeVisible();
    const countText = await page.locator("text=/\\d+ cafés in Cavite/i").textContent();
    expect(countText).not.toContain("50 cafés");
  });

  test("Search handles diacritics ('Dasmarinas' matches 'Dasmariñas')", async ({ page }) => {
    const searchInput = page.getByRole("searchbox", { name: /search cafés/i });
    
    // Type without tilde
    await searchInput.fill("Dasmarinas");
    await page.waitForTimeout(300);
    const countWithoutDiacritic = await page.locator("li[id^='cafe-']").count();
    expect(countWithoutDiacritic).toBeGreaterThan(0);

    // Type with tilde
    await searchInput.fill("Dasmariñas");
    await page.waitForTimeout(300);
    const countWithDiacritic = await page.locator("li[id^='cafe-']").count();
    expect(countWithDiacritic).toBe(countWithoutDiacritic);
  });

  test("Quick city pill filters correctly (Tagaytay & Silang)", async ({ page }) => {
    const tagaytayPill = page.getByRole("button", { name: "Tagaytay & Silang" });
    await tagaytayPill.click();

    // Verify URL parameter
    await expect(page).toHaveURL(/city=tagaytay-silang/);

    const cards = page.locator("li[id^='cafe-']");
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThan(50);
  });

  test("Open now filter toggles open status and updates count", async ({ page }) => {
    const openNowButton = page.getByRole("button", { name: /open now/i });
    await openNowButton.click();

    await expect(page).toHaveURL(/open=true/);
    await expect(openNowButton).toHaveAttribute("aria-pressed", "true");

    const cards = page.locator("li[id^='cafe-']");
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThanOrEqual(50);
  });

  test("Empty search results displays helpful zero state and 'Reset filters' works", async ({ page }) => {
    const searchInput = page.getByRole("searchbox", { name: /search cafés/i });
    await searchInput.fill("nonexistentcafenamexyz123");

    await expect(page.locator("text=/No cafés match your criteria/i")).toBeVisible();
    const clearButton = page.getByRole("button", { name: /browse all 50 cafés/i });
    await expect(clearButton).toBeVisible();

    await clearButton.click();
    await expect(page.locator("li[id^='cafe-']")).toHaveCount(50);
    await expect(searchInput).toHaveValue("");
  });

  test("Bookmark saves cafe to Scoutlist", async ({ page }) => {
    const firstBookmarkBtn = page.locator("li[id^='cafe-']").first().locator("button[aria-label*='Scoutlist']");
    const cafeTitle = await page.locator("li[id^='cafe-'] h3").first().textContent();
    expect(cafeTitle).toBeTruthy();

    // Click to bookmark
    await firstBookmarkBtn.click();
    await expect(firstBookmarkBtn).toHaveAttribute("aria-label", new RegExp(`Remove ${cafeTitle?.trim()}`, "i"));

    // Toggle back
    await firstBookmarkBtn.click();
    await expect(firstBookmarkBtn).toHaveAttribute("aria-label", new RegExp(`Save ${cafeTitle?.trim()}`, "i"));
  });
});
