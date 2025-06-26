import { test, expect } from '@/fixtures/pages';
import { USERS } from '@/constants';

// Reset storage state for this file to avoid being authenticated
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Sauce Demo Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('should login successfully with valid credentials', async ({
    loginPage,
    page,
  }) => {
    await test.step('Fill valid credentials and submit', async () => {
      await loginPage.login();
    });
    await test.step('Verify successful login', async () => {
      await expect(page).toHaveURL(/.*inventory\.html/);
      await expect(page.getByText('Products')).toBeVisible();
    });
  });

  test('should show error with invalid password', async ({
    page,
    loginPage,
  }) => {
    await test.step('Fill in invalid credentials and submit', async () => {
      await loginPage.login(USERS.INVALID);
    });
    await test.step('Verify error message for invalid credentials', async () => {
      await expect(page.getByTestId('error')).toBeVisible();
      await expect(page.getByTestId('error')).toContainText(
        'Username and password do not match'
      );
    });
  });

  test('should show error for locked out user', async ({ page, loginPage }) => {
    await test.step('Fill in locked out user credentials and submit', async () => {
      await loginPage.login(USERS.LOCKED);
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
