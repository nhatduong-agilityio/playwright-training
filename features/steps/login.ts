import { Given, When, Then } from '@/fixtures';
import { USERS } from '@/constants';

Given(
  'I have a clean session with no stored authentication',
  async ({ page, loginPage, context }) => {
    // Clear any existing authentication state
    await context.clearCookies();
    await context.clearPermissions();

    await loginPage.goto();

    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }
);

Given('I am on the login page', async ({ page, loginPage }) => {
  await page.reload();
  await loginPage.verifyAmOnLoginPage();
});

When('I enter valid email and password', async ({ loginPage }) => {
  await loginPage.loginAs(USERS.test.email, USERS.test.password);
});

When(
  'I enter valid email {string} and invalid password {string}',
  async ({ loginPage }, email: string, password: string) => {
    await loginPage.loginAs(email, password);
  }
);

When('I leave email and password fields empty', async ({ loginPage }) => {
  await loginPage.loginAs('', '');
});

When(
  'I enter email {string} and password {string}',
  async ({ loginPage }, email: string, password: string) => {
    await loginPage.loginAs(email, password);
  }
);

When('I submit the login form', async ({ loginPage }) => {
  await loginPage.loginButton.click();
});

Then('I should be logged in successfully', async ({ loginPage }) => {
  await loginPage.verifyLoginSuccess();
});

Then('I should see the dashboard', async ({ loginPage }) => {
  await loginPage.verifyLoginSuccess();
});

Then(
  'I should see an error message {string}',
  async ({ loginPage }, expectedMessage: string) => {
    await loginPage.verifyToastMessageVisible(expectedMessage);
  }
);

Then('I should remain on the login page', async ({ loginPage }) => {
  await loginPage.verifyAmOnLoginPage();
});

Then(
  'I should see validation errors for empty fields',
  async ({ loginPage }) => {
    await loginPage.verifyEmptyFieldValidationError();
  }
);
