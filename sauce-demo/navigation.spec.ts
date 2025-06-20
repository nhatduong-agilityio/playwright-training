import { test, expect, Page } from '@playwright/test';
import { BASE_URL, USERNAME, PASSWORD } from '../constants';

// Helper function to login
async function login(
  page: Page,
  username = USERNAME.STANDARD,
  password = PASSWORD.VALID
) {
  await page.goto(BASE_URL);
  await page.getByPlaceholder('Username').fill(username);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/.*inventory\.html/);
}

test.describe('Inventory Navigation', () => {
  test('That verify user is able to navigate to all sidebar items and reset app state', async ({
    page,
    context,
  }) => {
    // Step 1: Login as standard user
    await login(page);
    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(page.getByText('Products')).toBeVisible();

    // Step 2: Open sidebar and navigate to About
    await page.getByRole('button', { name: /open menu/i }).click();
    await page.getByRole('link', { name: /about/i }).click();
    await expect(page).toHaveURL(/saucelabs\.com/);
    await expect(
      page.getByText('Build apps users love with AI-driven insights')
    ).toBeVisible();
    await page.goBack();

    // Step 3: Open sidebar and navigate to All Items
    await page.getByRole('button', { name: /open menu/i }).click();
    await page.getByRole('link', { name: /all items/i }).click();
    await page.getByRole('button', { name: /close menu/i }).click();
    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(page.getByText('Products')).toBeVisible();

    // Step 4: Add an item to cart, open sidebar, click Reset App State
    await page
      .getByRole('button', { name: /add to cart/i })
      .first()
      .click();
    await expect(page.locator('.shopping_cart_badge')).toBeVisible();
    await page.getByRole('button', { name: /open menu/i }).click();
    await page.getByRole('link', { name: /reset app state/i }).click();
    await page.getByRole('button', { name: /close menu/i }).click();
    // Cart badge should disappear (cart is emptied)
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });
});
