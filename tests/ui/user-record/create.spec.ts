import { test } from '@/fixtures';
import { expect } from '@playwright/test';
import { INVALID_USERS, VALID_USER } from '@/constants';
import { waitResponseFromMethodPost } from '@/utils';
import { USERS_PATH } from '@/constants/urls';
import { deleteUser } from '@/actions';
import {
  EMAIL_REQUIRED_ERROR,
  EMAIL_INVALID_ERROR,
  PASSWORD_MISMATCH_ERROR,
} from '@/constants';

const VALIDATION_TEST_PARAMETERS = [
  {
    scenario: 'empty fields',
    userData: () => ({
      email: INVALID_USERS.empty.email,
      password: INVALID_USERS.empty.password,
      emailVisibility: false,
    }),
    validationMethod: 'verifyEmailFieldValidationError',
  },
  {
    scenario: 'invalid email format',
    userData: () => ({
      email: INVALID_USERS.badEmail.email,
      password: INVALID_USERS.badEmail.password,
      emailVisibility: false,
    }),
    validationMethod: 'verifyEmailFieldIsInvalid',
  },
  {
    scenario: 'mismatched password confirmation',
    userData: () => ({
      email: INVALID_USERS.mismatchedPassword.email(),
      password: INVALID_USERS.mismatchedPassword.password,
      passwordConfirm: INVALID_USERS.mismatchedPassword.passwordConfirm,
      emailVisibility: false,
    }),
    validationMethod: 'verifyPasswordConfirmationError',
  },
] as const;

test.describe('Create User Record', () => {
  let userId: string | undefined;
  let email: string;

  test.beforeEach(async ({ dashboardPage, tablePage }) => {
    email = VALID_USER.email;

    await dashboardPage.goto();
    await dashboardPage.expectOnDashboard();

    // Wait for table to load before starting tests
    await tablePage.waitForTableReady();

    await dashboardPage.newRecordButton.click();
  });

  test.afterEach(async ({ apiContext, dashboardPage, tablePage }) => {
    if (userId) {
      await deleteUser(apiContext, userId);
      await dashboardPage.refreshButton.click();

      await tablePage.waitForTableReady();
      userId = undefined;
    }
  });

  test('That verify user can create a new user with valid data', async ({
    dashboardPage,
    tablePage,
    page,
  }) => {
    const userData = {
      email,
      password: VALID_USER.password,
      username: VALID_USER.username,
      name: VALID_USER.name,
      emailVisibility: true,
    };

    await test.step('Create user via form submission', async () => {
      const [response] = await Promise.all([
        waitResponseFromMethodPost({
          url: USERS_PATH,
          page,
        }),
        dashboardPage.submitUserForm(userData),
      ]);

      const responseBody = await response.json();
      userId = responseBody.id;

      // Verify API response
      expect(response.status()).toBe(200);
      expect(responseBody.email).toBe(email);
      expect(responseBody.username).toBe(VALID_USER.username);
      expect(responseBody.name).toBe(VALID_USER.name);
    });

    await test.step('Verify user appears in table', async () => {
      await dashboardPage.refreshButton.click();
      await tablePage.waitForTableReady();
      // Wait for the record to appear using reliable method
      await tablePage.expectRowVisible('email', email);

      // Verify the user data in table
      await tablePage.expectRowData('email', email, {
        email,
        username: VALID_USER.username,
        name: VALID_USER.name,
        emailVisibility: true,
      });
    });
  });

  // Parameterized validation tests
  VALIDATION_TEST_PARAMETERS.forEach(
    ({ scenario, userData, validationMethod }) => {
      test(`That verify validation errors are shown for ${scenario}`, async ({
        dashboardPage,
      }) => {
        await dashboardPage.submitUserForm(userData());
        if (validationMethod === 'verifyEmailFieldValidationError') {
          await dashboardPage.expectFieldError(
            EMAIL_REQUIRED_ERROR,
            dashboardPage.emailInput
          );
        } else if (validationMethod === 'verifyEmailFieldIsInvalid') {
          await dashboardPage.expectFieldError(
            EMAIL_INVALID_ERROR,
            dashboardPage.container
          );
        } else if (validationMethod === 'verifyPasswordConfirmationError') {
          await dashboardPage.expectFieldError(
            PASSWORD_MISMATCH_ERROR,
            dashboardPage.container
          );
        }
        await dashboardPage.closeUserForm();
      });
    }
  );
});
