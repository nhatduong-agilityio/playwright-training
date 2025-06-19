import { test, expect } from '@playwright/test';
import { BASE_URL } from '../constants';

test.describe('Sauce Demo Login', () => {
  const baseUrl = BASE_URL;
  const validPassword = 'secret_sauce';

  const users = {
    standard: 'standard_user',
    locked: 'locked_out_user',
    problem: 'problem_user',
    performance: 'performance_glitch_user',
    error: 'error_user',
    visual: 'visual_user',
  };

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto(baseUrl);
    await page.getByPlaceholder('Username').fill(users.standard);
    await page.getByPlaceholder('Password').fill(validPassword);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(page.getByText('Products')).toBeVisible();
  });

  test('should show error with invalid password', async ({ page }) => {
    await page.goto(baseUrl);
    await page.getByPlaceholder('Username').fill(users.standard);
    await page.getByPlaceholder('Password').fill('wrong_password');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByTestId('error')).toBeVisible();
    await expect(page.getByTestId('error')).toContainText(
      'Username and password do not match'
    );
  });

  test('should show error for locked out user', async ({ page }) => {
    await page.goto(baseUrl);
    await page.getByPlaceholder('Username').fill(users.locked);
    await page.getByPlaceholder('Password').fill(validPassword);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByTestId('error')).toBeVisible();
    await expect(page.getByTestId('error')).toContainText(
      'Sorry, this user has been locked out.'
    );
  });

  test('should show error for empty username', async ({ page }) => {
    await page.goto(baseUrl);
    await page.getByPlaceholder('Password').fill(validPassword);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByTestId('error')).toBeVisible();
    await expect(page.getByTestId('error')).toContainText(
      'Username is required'
    );
  });

  test('should show error for empty password', async ({ page }) => {
    await page.goto(baseUrl);
    await page.getByPlaceholder('Username').fill(users.standard);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByTestId('error')).toBeVisible();
    await expect(page.getByTestId('error')).toContainText(
      'Password is required'
    );
  });
});
