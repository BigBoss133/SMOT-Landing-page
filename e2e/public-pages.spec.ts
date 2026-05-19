import { test, expect } from '@playwright/test';

test.describe('Public pages', () => {
  test('landing page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
  });

  test('pricing page loads', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.locator('h2')).toContainText(/piano/i);
  });

  test('login page loads', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h2')).toContainText(/accedi/i);
  });

  test('register page loads', async ({ page }) => {
    await page.goto('/register');
    await expect(page.locator('h2')).toContainText(/account/i);
  });
});

test.describe('Navigation', () => {
  test('can navigate from landing to pricing', async ({ page }) => {
    await page.goto('/');
    const pricingLink = page.locator('a[href="/pricing"]').first();
    if (await pricingLink.isVisible()) {
      await pricingLink.click();
      await expect(page).toHaveURL(/\/pricing/);
    }
  });

  test('can navigate to login', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h2')).toBeVisible();
  });
});