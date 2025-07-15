import { test } from '@/fixtures';
import { USERS } from '@/constants/users';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await test.step('Go to login page', async () => {
      await loginPage.goto();
      await loginPage.verifyAmOnLoginPage();
    });
  });

  test('User can log in with valid credentials', async ({ loginPage }) => {
    await test.step('Enter valid credentials', async () => {
      await loginPage.loginAs(USERS.test.email, USERS.test.password);
    });
    await test.step('Verify dashboard is visible', async () => {
      await loginPage.verifyLoginSuccess();
    });
  });

  test('Error is shown for invalid login credentials', async ({
    loginPage,
  }) => {
    await test.step('Enter valid email and invalid password', async () => {
      await loginPage.loginAs(USERS.admin.email, 'wrongpass');
    });
    await test.step('Verify error message is visible', async () => {
      await loginPage.verifyToastMessage('Invalid login credentials');
      await loginPage.verifyAmOnLoginPage();
    });
  });

  test('Error is shown for empty login fields', async ({ loginPage, page }) => {
    await test.step('Leave fields blank and attempt login', async () => {
      await loginPage.loginAs('', '');
    });
    await test.step('Verify validation error is visible', async () => {
      await loginPage.verifyLeaveFieldsEmpty();
      await loginPage.verifyAmOnLoginPage();
    });
  });
});
