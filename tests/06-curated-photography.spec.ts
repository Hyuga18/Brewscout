import { expect, test } from "@playwright/test";

test.describe("Curated Photography Suite", () => {
  test("Card media windows render authentic curated covers", async ({ page }) => {
    await page.goto("/explore");
    await page.waitForSelector("li[id^='cafe-']");

    const totalCards = await page.locator("li[id^='cafe-']").count();
    expect(totalCards).toBeGreaterThan(0);

    const cardsWithImages = await page.$$eval("li[id^='cafe-'] img", (imgs) =>
      imgs.map((img) => ({
        src: img.getAttribute("src"),
      }))
    );

    // 100% of cards should possess an authentic cover from /cafes/
    expect(cardsWithImages.length).toBe(totalCards);
    const validCovers = cardsWithImages.filter((img) => img.src && img.src.includes("/cafes/"));
    expect(validCovers.length).toBe(totalCards);
  });

  test("Dossier page renders authentic hero gallery and credit", async ({ page }) => {
    await page.goto("/cafe/kopakoppi-cafe-tagaytay");
    await expect(page.locator("h1")).toContainText(/kopakoppi/i);

    // Check hero image
    const heroImg = page.locator("figure img, section img").first();
    await expect(heroImg).toBeVisible();
    const src = await heroImg.getAttribute("src");
    expect(src).toContain("/cafes/kopakoppi-cafe-tagaytay/cover.jpg");

    // Check credit link exists
    const credit = page.locator("figcaption");
    await expect(credit).toBeVisible();
    await expect(credit).toContainText("Wanderlog");
  });
});
