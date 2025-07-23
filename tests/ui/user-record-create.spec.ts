import { test } from '@/fixtures';
import { expect } from '@playwright/test';
import { INVALID_USERS, VALID_USER } from '@/constants';
import { waitResponseFromMethodPost } from '@/utils';
import { USERS_PATH } from '@/constants/urls';
import { deleteUserAction } from '@/actions';

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

  test.beforeEach(async ({ dashboardPage }) => {
    email = VALID_USER.email;
    await dashboardPage.goto();
    await dashboardPage.verifyAmOnDashboardPage();
    await dashboardPage.createNewRecord();
  });

  test.afterEach(async ({ apiContext, dashboardPage }) => {
    if (userId) {
      await deleteUserAction(apiContext, userId);
      await dashboardPage.refreshTable();
      userId = undefined;
    }
  });

  test('That verify user can create a new user with valid data', async ({
    dashboardPage,
    page,
  }) => {
    const [response] = await Promise.all([
      waitResponseFromMethodPost({
        url: USERS_PATH,
        page,
      }),
      dashboardPage.createUser({
        email,
        password: VALID_USER.password,
        username: VALID_USER.username,
        name: VALID_USER.name,
        emailVisibility: true,
      }),
    ]);
    const responseBody = await response.json();

    userId = responseBody.id;
    expect(response.status()).toBe(200);
    expect(responseBody.email).toBe(email);
    await dashboardPage.verifyUserIsCreated(email);
  });

  // Parameterized validation tests
  VALIDATION_TEST_PARAMETERS.forEach(
    ({ scenario, userData, validationMethod }) => {
      test(`That verify validation errors are shown for ${scenario}`, async ({
        dashboardPage,
      }) => {
        await dashboardPage.createUser(userData());
        await dashboardPage[validationMethod]();
        await dashboardPage.closeFormContainer();
      });
    }
  );
});
