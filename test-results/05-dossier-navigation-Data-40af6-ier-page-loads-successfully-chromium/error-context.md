# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 05-dossier-navigation.spec.ts >> Data Integrity & Dossier QA Suite >> Navigating to a cafe dossier page loads successfully
- Location: tests/05-dossier-navigation.spec.ts:4:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('h1')
Expected: visible
Error: strict mode violation: locator('h1') resolved to 2 elements:
    1) <h1 class="font-display text-3xl sm:text-5xl font-semibold text-espresso tracking-tight text-balance">16th Cent Koffie</h1> aka getByRole('heading', { name: '16th Cent Koffie' })
    2) <h1 class="sr-only">Cavite Specialty Coffee Gazetteer</h1> aka getByRole('main').getByText('Cavite Specialty Coffee')

Call log:
  - Expect "toBeVisible" locator('h1') with timeout 5000ms
  - waiting for locator('h1')
    4 × locator resolved to <h1 class="sr-only">Cavite Specialty Coffee Gazetteer</h1>
      - unexpected value "hidden"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - link "Brewscout" [ref=e4] [cursor=pointer]:
      - /url: /
    - navigation "Main navigation" [ref=e10]:
      - link "Explorer" [ref=e11] [cursor=pointer]:
        - /url: /
      - link "Field Guide" [ref=e12] [cursor=pointer]:
        - /url: /about
  - main [ref=e13]:
    - generic [ref=e14]:
      - button "Back to Explorer" [ref=e16] [cursor=pointer]
      - article [ref=e20]:
        - generic [ref=e21]:
          - generic [ref=e26]: 16th Cent Koffie
          - generic [ref=e27]: Tagaytay, Cavite
        - generic [ref=e28]:
          - generic [ref=e29]:
            - generic [ref=e30]:
              - generic [ref=e31]: Open now
              - generic [ref=e35]: Tagaytay, Cavite
            - generic [ref=e36]:
              - button "Save 16th Cent Koffie to Scoutlist" [ref=e37] [cursor=pointer]
              - button "Share café" [ref=e40] [cursor=pointer]:
                - generic [ref=e47]: Share
          - heading "16th Cent Koffie" [level=1] [ref=e49]
          - generic [ref=e50]: Typical Latte ₱100–150
          - paragraph [ref=e52]: Overlooking open-air ridge café at Zer Franco Bed & Breakfast with direct Taal volcano views.
        - region "Work & Hospitality Amenities" [ref=e53]:
          - heading "Work & Hospitality Amenities" [level=2] [ref=e55]
          - generic [ref=e56]:
            - generic [ref=e63]:
              - term [ref=e64]: Wi-Fi Connectivity
              - definition [ref=e65]: Standard / Mobile Hotspot
              - definition [ref=e66]: Public connection or mobile hotspot recommended
            - generic [ref=e70]:
              - term [ref=e71]: Power Outlets
              - definition [ref=e72]: Limited Power Points
              - definition [ref=e73]: Arrive with batteries charged
            - generic [ref=e79]:
              - term [ref=e80]: Atmosphere
              - definition [ref=e81]: Taal Ridge Caldera View
              - definition [ref=e82]: Scenic ridge vistas; great for reading and leisure
            - generic [ref=e88]:
              - term [ref=e89]: Parking & Access
              - definition [ref=e90]: Roadside / Public Access
              - definition [ref=e91]: Street parking or nearby commercial pay lots
            - generic [ref=e99]:
              - term [ref=e100]: Pet Policy
              - definition [ref=e101]: Indoor Restrictions
              - definition [ref=e102]: Confirm with staff for al fresco pet guidelines
            - generic [ref=e108]:
              - term [ref=e109]: Brew Standard
              - definition [ref=e110]: Specialty Grade (80+)
              - definition [ref=e111]: Single-origin pour-overs and calibrated espresso
        - generic [ref=e112]:
          - region "Hours of Service" [ref=e113]:
            - heading "Hours of Service" [level=2] [ref=e115]
            - generic [ref=e116]:
              - generic [ref=e118]:
                - generic [ref=e119]:
                  - generic [ref=e120]: Today · Tuesday
                  - generic [ref=e121]: Open
                - generic [ref=e125]: 8 AM – 7 PM
              - generic [ref=e127]:
                - generic [ref=e128]: 6 AM
                - generic [ref=e129]: 12 PM (Noon)
                - generic [ref=e130]: 6 PM
                - generic [ref=e131]: Midnight
              - generic [ref=e134]:
                - generic [ref=e135]:
                  - generic [ref=e136]: Sunday
                  - generic [ref=e138]: 8 AM–7 PM
                - generic [ref=e139]:
                  - generic [ref=e140]: Monday
                  - generic [ref=e142]: 8 AM–7 PM
                - generic [ref=e143]:
                  - generic [ref=e144]: Tuesday
                  - generic [ref=e147]: 8 AM–7 PM
                - generic [ref=e148]:
                  - generic [ref=e149]: Wednesday
                  - generic [ref=e151]: 8 AM–7 PM
                - generic [ref=e152]:
                  - generic [ref=e153]: Thursday
                  - generic [ref=e155]: 8 AM–7 PM
                - generic [ref=e156]:
                  - generic [ref=e157]: Friday
                  - generic [ref=e159]: 8 AM–7 PM
                - generic [ref=e160]:
                  - generic [ref=e161]: Saturday
                  - generic [ref=e163]: 8 AM–7 PM
          - region "Getting There" [ref=e164]:
            - heading "Getting There" [level=2] [ref=e166]
            - generic [ref=e167]:
              - generic [ref=e168]:
                - text: Physical Location
                - paragraph [ref=e169]: Tagaytay, Cavite (Verified GPS coordinates available)
              - link "Navigate in Google Maps" [ref=e170] [cursor=pointer]:
                - /url: https://www.google.com/maps/dir/?api=1&destination=14.1165844,120.9862234
        - generic [ref=e174]:
          - generic [ref=e175]:
            - heading "More in Tagaytay" [level=2] [ref=e177]
            - link "View all in Tagaytay →" [ref=e178] [cursor=pointer]:
              - /url: /?city=Tagaytay
          - generic [ref=e179]:
            - link "Open Greenhouse Cafe Tagaytay ₱130–150 latte Explore →" [ref=e180] [cursor=pointer]:
              - /url: /cafe/greenhouse-cafe
              - generic [ref=e181]: Open
              - generic [ref=e191]:
                - generic [ref=e192]:
                  - heading "Greenhouse Cafe" [level=3] [ref=e193]
                  - paragraph [ref=e194]: Tagaytay
                - generic [ref=e195]:
                  - generic [ref=e196]: ₱130–150 latte
                  - generic [ref=e197]: Explore →
            - link "Open Barista Loft Tagaytay ₱150–190 latte Explore →" [ref=e198] [cursor=pointer]:
              - /url: /cafe/barista-loft
              - generic [ref=e199]: Open
              - generic [ref=e209]:
                - generic [ref=e210]:
                  - heading "Barista Loft" [level=3] [ref=e211]
                  - paragraph [ref=e212]: Tagaytay
                - generic [ref=e213]:
                  - generic [ref=e214]: ₱150–190 latte
                  - generic [ref=e215]: Explore →
            - link "Open Bag of Beans Tagaytay ₱155–175 latte Explore →" [ref=e216] [cursor=pointer]:
              - /url: /cafe/bag-of-beans
              - generic [ref=e217]: Open
              - generic [ref=e227]:
                - generic [ref=e228]:
                  - heading "Bag of Beans" [level=3] [ref=e229]
                  - paragraph [ref=e230]: Tagaytay
                - generic [ref=e231]:
                  - generic [ref=e232]: ₱155–175 latte
                  - generic [ref=e233]: Explore →
            - link "Open Stellar Brews Tagaytay ₱120–160 latte Explore →" [ref=e234] [cursor=pointer]:
              - /url: /cafe/stellar-brews
              - generic [ref=e235]: Open
              - generic [ref=e245]:
                - generic [ref=e246]:
                  - heading "Stellar Brews" [level=3] [ref=e247]
                  - paragraph [ref=e248]: Tagaytay
                - generic [ref=e249]:
                  - generic [ref=e250]: ₱120–160 latte
                  - generic [ref=e251]: Explore →
  - button "Open Next.js Dev Tools" [ref=e257] [cursor=pointer]
  - alert [ref=e261]: Cavite Specialty Coffee Gazetteer
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Data Integrity & Dossier QA Suite", () => {
  4  |   test("Navigating to a cafe dossier page loads successfully", async ({ page }) => {
  5  |     await page.goto("/");
  6  |     await expect(page.locator("li[id^='cafe-']").first()).toBeVisible({ timeout: 10000 });
  7  | 
  8  |     const firstCardLink = page.locator("li[id^='cafe-'] a[href^='/cafe/']").first();
  9  |     const href = await firstCardLink.getAttribute("href");
  10 |     expect(href).toMatch(/^\/cafe\/[a-z0-9-]+$/);
  11 | 
  12 |     await firstCardLink.click();
  13 |     await expect(page).toHaveURL(new RegExp(href!));
  14 | 
  15 |     // Check h1 contains cafe name
  16 |     const heading = page.locator("h1");
> 17 |     await expect(heading).toBeVisible();
     |                           ^ Error: expect(locator).toBeVisible() failed
  18 | 
  19 |     // Check operating hours chronometer or schedule is present
  20 |     await expect(page.locator("text=/Operating Rhythm|Hours|Open|Closed/i").first()).toBeVisible();
  21 | 
  22 |     // Check Directions button
  23 |     const directionsLink = page.getByRole("link", { name: /directions|get directions/i });
  24 |     if (await directionsLink.count() > 0) {
  25 |       const gmapsHref = await directionsLink.getAttribute("href");
  26 |       expect(gmapsHref).toMatch(/google\.com\/maps/);
  27 |       expect(await directionsLink.getAttribute("target")).toBe("_blank");
  28 |       expect(await directionsLink.getAttribute("rel")).toContain("noopener");
  29 |     }
  30 |   });
  31 | 
  32 |   test("Invalid slug triggers 404 page gracefully", async ({ page }) => {
  33 |     const response = await page.goto("/cafe/non-existent-cafe-slug-404-test");
  34 |     expect([200, 404]).toContain(response?.status());
  35 |     await expect(page.locator("text=/Not Found|404/i").first()).toBeVisible();
  36 |   });
  37 | 
  38 |   test("About page loads cleanly with design system tokens", async ({ page }) => {
  39 |     await page.goto("/about");
  40 |     await expect(page.locator("h1")).toBeVisible();
  41 |     await expect(page.locator("text=/Brewscout/i").first()).toBeVisible();
  42 |   });
  43 | });
  44 | 
```