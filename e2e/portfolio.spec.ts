import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// NOTE: written to run with `npm run test:e2e` where a Playwright browser is
// installed (`npx playwright install chromium`).

test.describe("desktop", () => {
  test.skip(({ isMobile }) => isMobile, "desktop-only");

  test("boot can be skipped and the desktop appears", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Skip intro" }).click();
    await expect(page.getByRole("dialog", { name: "Home" })).toBeVisible();
    await expect(page.getByRole("dialog", { name: "System Overview" })).toBeVisible();
  });

  test("system overview reports real browser values and keeps IP opt-in", async ({ page }) => {
    const ipRequests: string[] = [];
    page.on("request", (r) => r.url().includes("/api/ip") && ipRequests.push(r.url()));
    await page.goto("/");
    await page.getByRole("button", { name: "Skip intro" }).click();
    const win = page.getByRole("dialog", { name: "System Overview" });
    await expect(win.getByText("Viewport size")).toBeVisible();
    await expect(win.getByText("Screen size")).toBeVisible();
    expect(ipRequests).toHaveLength(0);
    await win.getByRole("button", { name: "Look up my public IP" }).click();
    await expect.poll(() => ipRequests.length).toBe(1);
  });

  test("terminal runs registered commands only", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Skip intro" }).click();
    await page.getByRole("navigation", { name: "Applications" }).getByRole("button", { name: "Terminal" }).click();
    const term = page.getByRole("dialog", { name: "Terminal" });
    const input = term.getByLabel(/adom@portfolio/);
    await input.fill("whoami");
    await input.press("Enter");
    await expect(term.getByRole("log")).toContainText("Kwame Emmanuel Adom");
    await input.fill("cat /etc/passwd");
    await input.press("Enter");
    await expect(term.getByRole("log")).toContainText("command not found");
  });

  test("windows can be dragged by the title bar", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Skip intro" }).click();
    const win = page.getByRole("dialog", { name: "Home" });
    const bar = win.getByLabel(/Home title bar/);
    const before = await win.boundingBox();
    const b = await bar.boundingBox();
    if (!before || !b) throw new Error("no boxes");
    await page.mouse.move(b.x + 60, b.y + 10);
    await page.mouse.down();
    await page.mouse.move(b.x + 160, b.y + 70, { steps: 5 });
    await page.mouse.up();
    const after = await win.boundingBox();
    expect(after?.x).not.toBe(before.x);
  });

  test("reduced motion skips the intro", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Skip intro" })).toHaveCount(0);
    await expect(page.getByRole("dialog", { name: "Home" })).toBeVisible();
  });
});

test.describe("mobile", () => {
  test.skip(({ isMobile }) => !isMobile, "mobile-only");

  test("uses a single full-screen view with a bottom app bar", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Skip intro" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await page.getByRole("navigation", { name: "Applications" }).getByRole("button", { name: "Projects" }).click();
    await expect(page.getByRole("main", { name: "Projects" })).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
  });
});

test.describe("direct routes work without the desktop", () => {
  for (const path of ["/projects", "/projects/adepamarket", "/skills", "/security-lab", "/network-tools", "/about", "/cv", "/contact"]) {
    test(`${path} renders and has no serious accessibility violations`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("h1")).toBeVisible();
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
      expect(results.violations.filter((v) => v.impact === "serious" || v.impact === "critical")).toEqual([]);
    });
  }

  test("CV page offers no download when the PDF is absent", async ({ page }) => {
    await page.goto("/cv");
    await expect(page.getByRole("link", { name: /Download CV/ })).toHaveCount(0);
  });
});
