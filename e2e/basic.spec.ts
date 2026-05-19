import { test, expect } from "@playwright/test";

test.describe("SMOT Landing Page", () => {
  test("should load the landing page", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/SMOT/);
  });

  test("landing page shows hero section", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("archivio intelligente");
    await expect(page.locator("text=Scarica gratis")).toBeVisible();
    await expect(page.locator("text=Vedi piani")).toBeVisible();
  });

  test("landing page shows feature cards", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=100% Offline")).toBeVisible();
    await expect(page.locator("text=Ricerca Full-Text")).toBeVisible();
    await expect(page.locator("text=Chat IA Locale")).toBeVisible();
    await expect(page.locator("text=Privacy First")).toBeVisible();
  });

  test("should navigate to pricing page", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.locator("h2")).toContainText("Scegli il tuo piano");
  });

  test("pricing page shows plan options", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.locator("text=€9.99")).toBeVisible();
    await expect(page.locator("text=€89.99")).toBeVisible();
  });

  test("should show login page with form", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("login form shows validation error for invalid email", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', "invalid");
    await page.fill('input[type="password"]', "pass");
    await page.click('button[type="submit"]');
    await expect(page.locator("text=valida")).toBeVisible();
  });

  test("register page loads with form", async ({ page }) => {
    await page.goto("/register");
    await expect(page.locator("h2")).toContainText("Registrati");
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("should navigate to register from login", async ({ page }) => {
    await page.goto("/login");
    await page.click('a[href="/register"]');
    await expect(page).toHaveURL(/\/register/);
  });

  test("navbar is visible on all pages", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("nav")).toBeVisible();
    await page.goto("/pricing");
    await expect(page.locator("nav")).toBeVisible();
    await page.goto("/login");
    await expect(page.locator("nav")).toBeVisible();
  });

  test("checkout redirects to login when unauthenticated", async ({ page }) => {
    await page.goto("/checkout");
    await expect(page).toHaveURL(/\/login/);
  });

  test("dashboard redirects to login when unauthenticated", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });
});
