import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Run with `npm run test:e2e` after `npx playwright install chromium`.
// These mirror the checks that were run by hand against the static GitHub Pages
// build under /CRAZYCV/ (intro, skip/replay, terminal, reduced motion, no-JS, axe).

test.describe("intro", () => {
  test.skip(({ isMobile }) => isMobile, "keyboard flow is desktop-only");

  test("skip link, then Skip intro, are the first two tab stops and Skip lands on the hero", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(page.locator(":focus")).toHaveText("Skip to content");
    await page.keyboard.press("Tab");
    await expect(page.locator(":focus")).toContainText("Skip intro");
    await page.keyboard.press("Enter");
    await expect(page.locator("#hero")).toBeFocused();
    await expect(page.locator(".site-nav")).toBeVisible();
  });

  test("a returning visitor is not forced through the intro, and can replay it", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Skip intro/ }).click();
    await page.reload();
    expect(await page.evaluate(() => document.getElementById("intro")?.offsetHeight)).toBe(0);
    await expect(page.locator(".site-nav")).toBeVisible();
    await page.getByRole("button", { name: "Replay intro" }).first().click();
    await expect.poll(() => page.evaluate(() => document.getElementById("intro")?.offsetHeight ?? 0)).toBeGreaterThan(1000);
  });
});

test.describe("terminal", () => {
  test("runs only registered commands and never scrolls unprompted", async ({ page }) => {
    await page.goto("/#terminal");
    const input = page.locator("#terminal-input");
    const log = page.getByRole("log", { name: "Terminal output" });
    await input.fill("whoami");
    await input.press("Enter");
    await expect(log).toContainText("Kwame Emmanuel Adom");
    await input.fill("cat /etc/passwd");
    await input.press("Enter");
    await expect(log).toContainText("command not found");
    const y = await page.evaluate(() => scrollY);
    await input.fill("about");
    await input.press("Enter");
    await expect(page.getByRole("button", { name: /jump to about/ })).toBeVisible();
    expect(await page.evaluate(() => scrollY)).toBe(y);
  });

  test("'cv download' downloads the real PDF", async ({ page }) => {
    await page.goto("/#terminal");
    const input = page.locator("#terminal-input");
    const [download] = await Promise.all([page.waitForEvent("download"), input.fill("cv download").then(() => input.press("Enter"))]);
    expect(download.suggestedFilename()).toBe("Kwame-Emmanuel-Adom-CV.pdf");
  });
});

test.describe("system overview", () => {
  test("reports real browser values and keeps the IP lookup opt-in", async ({ page }) => {
    const ipRequests: string[] = [];
    page.on("request", (r) => r.url().includes("/api/ip") && ipRequests.push(r.url()));
    await page.goto("/#system");
    await expect(page.getByText("Viewport size")).toBeVisible();
    await expect(page.getByText("Screen size")).toBeVisible();
    expect(ipRequests).toHaveLength(0);
  });
});

test.describe("accessibility and resilience", () => {
  test("reduced motion collapses the intro to one still screen", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const { h, vh } = await page.evaluate(() => ({ h: document.getElementById("intro")?.offsetHeight ?? 0, vh: innerHeight }));
    expect(h).toBeLessThanOrEqual(vh + 2);
    await expect(page.locator(".site-nav")).toBeVisible();
  });

  test("no horizontal overflow", async ({ page }) => {
    await page.goto("/#hero");
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  });

  for (const path of ["/#hero", "/projects/", "/projects/adepamarket/", "/skills/", "/security-lab/", "/cv/", "/contact/"]) {
    test(`axe finds no WCAG A/AA violations on ${path}`, async ({ page }) => {
      await page.goto(path);
      // Reveal animations are transitions; settle them so contrast is measured on final colours.
      await page.addStyleTag({ content: "*{transition:none!important;animation:none!important}.reveal,.reveal-img,.rule-draw{opacity:1!important;transform:none!important;clip-path:none!important}" });
      const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
      expect(r.violations.map((v) => v.id)).toEqual([]);
    });
  }
});

test.describe("no JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("the portfolio is fully readable and the intro does not hide it", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#hero h1")).toBeVisible();
    await expect(page.locator("#intro")).toBeHidden();
    await expect(page.locator('a[href^="mailto:kwameadom607@gmail.com"]').first()).toBeVisible();
  });
});
