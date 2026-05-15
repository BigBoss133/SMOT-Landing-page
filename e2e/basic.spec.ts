import { test, expect } from "@playwright/test";

test.describe("SMOT Landing Page", () => {
  test("should load the landing page", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/SMOT/);
  });

  test("should navigate to pricing", async ({ page }) => {
    await page.goto(/pricing");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("should show login page", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });
});

