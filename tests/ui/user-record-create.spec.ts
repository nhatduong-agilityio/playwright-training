import { test } from '@/fixtures';
import { expect } from '@playwright/test';
import { VALID_USER } from '@/constants';
import { waitResponseFromMethodPost } from '@/utils';
import { USERS_PATH } from '@/constants/urls';
import { deleteUserAction } from '@/actions';

test.describe('Create User Record', () => {
  let userId: string | undefined;
  let email: string;

  test.beforeEach(async ({ dashboardPage }) => {
    email = VALID_USER.email();
    await dashboardPage.goto();
    await dashboardPage.verifyAmOnDashboardPage();
  });

  test.afterEach(async ({ apiContext }) => {
    if (userId) {
      await deleteUserAction(apiContext, userId);
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
        username: VALID_USER.username(),
        name: VALID_USER.name,
      }),
    ]);
    const responseBody = await response.json();

    userId = responseBody.id;
    expect(response.status()).toBe(200);
    expect(responseBody.email).toBe(email);
  });
});
