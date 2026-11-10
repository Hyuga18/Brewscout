import { expect, test } from "@playwright/test";

test.describe("Dossier Navigation Suite (Option 3)", () => {
  test("Dossier page renders multi-app navigation choices and copy address", async ({ page, context }) => {
    // Grant clipboard permissions (Chromium only, ignore on WebKit)
    await context.grantPermissions(["clipboard-read", "clipboard-write"]).catch(() => {});

    await page.goto("/cafe/kopakoppi-cafe-tagaytay");
    await page.waitForSelector("h1");

    // Driving navigation heading
    await expect(page.locator("text=Driving Navigation")).toBeVisible();

    // Check Google Maps link
    const googleLink = page.locator("a[aria-label*='Google Maps']");
    await expect(googleLink).toBeVisible();
    const googleHref = await googleLink.getAttribute("href");
    expect(googleHref).toContain("google.com/maps/dir");

    // Check Waze link
    const wazeLink = page.locator("a[aria-label*='Waze']");
    await expect(wazeLink).toBeVisible();
    const wazeHref = await wazeLink.getAttribute("href");
    expect(wazeHref).toContain("waze.com/ul");

    // Check Apple Maps link
    const appleLink = page.locator("a[aria-label*='Apple Maps']");
    await expect(appleLink).toBeVisible();
    const appleHref = await appleLink.getAttribute("href");
    expect(appleHref).toContain("maps.apple.com");

    // Check Copy Address Button
    const copyBtn = page.getByRole("button", { name: /copy street address/i });
    await expect(copyBtn).toBeVisible();
    await copyBtn.click();

    // After click, should show copied feedback
    await expect(page.locator("text=Address copied to clipboard!")).toBeVisible();
  });
});
