import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("landing page loads", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("SMOT");
  });

  test("pricing page loads", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.locator("h2")).toContainText("Scegli il tuo piano");
  });

  test("login page loads", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});
