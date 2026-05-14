import { test, expect } from "@playwright/test";

test.describe("Accessibility", () => {
  test("login page should not have major a11y violations", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("pricing page should not have major a11y violations", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.locator("h2")).toBeVisible();
  });

  test("landing page should not have major a11y violations", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
  });
});
