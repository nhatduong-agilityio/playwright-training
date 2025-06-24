import { test, expect } from '@playwright/test';
import { BASE_URL, USERNAME, PASSWORD } from '../constants';

test.describe('Sauce Demo Login', () => {
  const baseUrl = BASE_URL;

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto(baseUrl);
    await page.getByPlaceholder('Username').fill(USERNAME.STANDARD);
    await page.getByPlaceholder('Password').fill(PASSWORD.VALID);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(page.getByText('Products')).toBeVisible();
  });

  test('should show error with invalid password', async ({ page }) => {
    await page.goto(baseUrl);
    await page.getByPlaceholder('Username').fill(USERNAME.STANDARD);
    await page.getByPlaceholder('Password').fill(PASSWORD.IN_VALID);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByTestId('error')).toBeVisible();
    await expect(page.getByTestId('error')).toContainText(
      'Username and password do not match'
    );
  });

  test('should show error for locked out user', async ({ page }) => {
    await page.goto(baseUrl);
    await page.getByPlaceholder('Username').fill(USERNAME.LOCKED);
    await page.getByPlaceholder('Password').fill(PASSWORD.VALID);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByTestId('error')).toBeVisible();
    await expect(page.getByTestId('error')).toContainText(
      'Sorry, this user has been locked out.'
    );
  });

  test('should show error for empty username', async ({ page }) => {
    await page.goto(baseUrl);
    await page.getByPlaceholder('Password').fill(PASSWORD.VALID);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByTestId('error')).toBeVisible();
    await expect(page.getByTestId('error')).toContainText(
      'Username is required'
    );
  });

  test('should show error for empty password', async ({ page }) => {
    await page.goto(baseUrl);
    await page.getByPlaceholder('Username').fill(USERNAME.STANDARD);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByTestId('error')).toBeVisible();
    await expect(page.getByTestId('error')).toContainText(
      'Password is required'
    );
  });
});
