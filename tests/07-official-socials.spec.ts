import { expect, test } from "@playwright/test";
import { getCuratedSocials } from "@/lib/cafe-socials";

test.describe("Official Social Profiles Suite", () => {
  test("Dossier page renders authentic social links for Kopakoppi Cafe", async ({ page }) => {
    await page.goto("/cafe/kopakoppi-cafe-tagaytay");
    await page.waitForSelector("h1");

    // Official profiles header
    const profilesHeader = page.locator("text=Official Profiles");
    await expect(profilesHeader).toBeVisible();

    // Check Facebook link
    const fbLink = page.locator("a:has-text('Facebook ↗')");
    await expect(fbLink).toBeVisible();
    await expect(fbLink).toHaveAttribute("href", "https://facebook.com/kopakoppicafe");
    await expect(fbLink).toHaveAttribute("target", "_blank");
    await expect(fbLink).toHaveAttribute("rel", "noopener noreferrer");

    // Check Instagram link
    const igLink = page.locator("a:has-text('Instagram ↗')");
    await expect(igLink).toBeVisible();
    await expect(igLink).toHaveAttribute("href", "https://instagram.com/kopakoppicafe");
  });

  test("Dossier page renders website link for Bag of Beans", async ({ page }) => {
    await page.goto("/cafe/bag-of-beans");
    await page.waitForSelector("h1");

    // Check Website link
    const webLink = page.locator("a:has-text('Website ↗')");
    await expect(webLink).toBeVisible();
    await expect(webLink).toHaveAttribute("href", "https://bagofbeans.ph/");
  });

  test("getCuratedSocials protects against prototype collisions and maintains defensive copying", () => {
    // Prototype pollution & reserved keys
    expect(getCuratedSocials("__proto__")).toBeNull();
    expect(getCuratedSocials("constructor")).toBeNull();
    expect(getCuratedSocials("toString")).toBeNull();
    expect(getCuratedSocials("valueOf")).toBeNull();
    expect(getCuratedSocials("hasOwnProperty")).toBeNull();
    expect(getCuratedSocials("")).toBeNull();
    expect(getCuratedSocials("non-existent-cafe-slug")).toBeNull();

    // Canonical & alias resolution
    const canonical = getCuratedSocials("kopakoppi-cafe-tagaytay");
    const alias = getCuratedSocials("kopakoppi-cafe");
    expect(canonical).not.toBeNull();
    expect(alias).not.toBeNull();
    expect(canonical?.fbUrl).toBe("https://facebook.com/kopakoppicafe");
    expect(alias?.fbUrl).toBe("https://facebook.com/kopakoppicafe");

    // Defensive copy verification: mutating copy does not mutate subsequent calls
    if (canonical) {
      canonical.fbUrl = "https://mutated.com";
    }
    const fresh = getCuratedSocials("kopakoppi-cafe-tagaytay");
    expect(fresh?.fbUrl).toBe("https://facebook.com/kopakoppicafe");
  });
});
