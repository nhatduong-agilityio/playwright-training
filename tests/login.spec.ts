import { test, expect } from '@playwright/test';
import { BASE_URL, USERS } from '@/constants';

test.describe('Sauce Demo Login', () => {
  const baseUrl = BASE_URL;

  test.beforeEach(async ({ page }) => {
    await page.goto(baseUrl);
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await test.step('Fill in valid credentials and submit', async () => {
      await page.getByPlaceholder('Username').fill(USERS.STANDARD.username);
      await page.getByPlaceholder('Password').fill(USERS.STANDARD.password);
      await page.getByRole('button', { name: 'Login' }).click();
    });
    await test.step('Verify successful login', async () => {
      await expect(page).toHaveURL(/.*inventory\.html/);
      await expect(page.getByText('Products')).toBeVisible();
    });
  });

  test('should show error with invalid password', async ({ page }) => {
    await test.step('Fill in invalid credentials and submit', async () => {
      await page.getByPlaceholder('Username').fill(USERS.INVALID.username);
      await page.getByPlaceholder('Password').fill(USERS.INVALID.password);
      await page.getByRole('button', { name: 'Login' }).click();
    });
    await test.step('Verify error message for invalid credentials', async () => {
      await expect(page.getByTestId('error')).toBeVisible();
      await expect(page.getByTestId('error')).toContainText(
        'Username and password do not match'
      );
    });
  });

  test('should show error for locked out user', async ({ page }) => {
    await test.step('Fill in locked out user credentials and submit', async () => {
      await page.getByPlaceholder('Username').fill(USERS.LOCKED.username);
      await page.getByPlaceholder('Password').fill(USERS.LOCKED.password);
      await page.getByRole('button', { name: 'Login' }).click();
    });
    await test.step('Verify error message for locked out user', async () => {
      await expect(page.getByTestId('error')).toBeVisible();
      await expect(page.getByTestId('error')).toContainText(
        'Sorry, this user has been locked out.'
      );
    });
  });

  test('should show error for empty username', async ({ page }) => {
    await test.step('Submit with empty username', async () => {
      await page.getByPlaceholder('Password').fill(USERS.STANDARD.password);
      await page.getByRole('button', { name: 'Login' }).click();
    });
    await test.step('Verify error message for empty username', async () => {
      await expect(page.getByTestId('error')).toBeVisible();
      await expect(page.getByTestId('error')).toContainText(
        'Username is required'
      );
    });
  });

  test('should show error for empty password', async ({ page }) => {
    await test.step('Submit with empty password', async () => {
      await page.getByPlaceholder('Username').fill(USERS.STANDARD.username);
      await page.getByRole('button', { name: 'Login' }).click();
    });
    await test.step('Verify error message for empty password', async () => {
      await expect(page.getByTestId('error')).toBeVisible();
      await expect(page.getByTestId('error')).toContainText(
        'Password is required'
      );
    });
  });
});
