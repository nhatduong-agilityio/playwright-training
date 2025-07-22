import { createUserAction, deleteUserAction } from '@/actions';
import { USERS_PATH, VALID_USER } from '@/constants';
import { test } from '@/fixtures';
import { waitForResponseFromMethodGet } from '@/utils';
import { expect } from '@playwright/test';

test.describe('Read User Record', () => {
  let userId: string | undefined;
  let email: string;

  test.beforeEach(async ({ apiContext, dashboardPage }) => {
    await dashboardPage.goto();
    await dashboardPage.verifyAmOnDashboardPage();

    email = VALID_USER.email();
    const userResponse = await createUserAction(apiContext, {
      email,
      password: VALID_USER.password,
      passwordConfirm: VALID_USER.password,
      username: VALID_USER.username(),
      name: VALID_USER.name,
      emailVisibility: true,
    });
    const user = await userResponse.json();
    userId = user.id;

    await dashboardPage.refreshTable();
    await dashboardPage.verifyUserIsCreated(email);
  });

  test.afterEach(async ({ dashboardPage, apiContext }) => {
    if (userId) {
      await dashboardPage.closeFormContainer();
      await deleteUserAction(apiContext, userId);
      await dashboardPage.refreshTable();
      userId = undefined;
    }
  });

  test('That verify user can view details of an existing user', async ({
    dashboardPage,
    page,
  }) => {
    if (!userId) {
      throw new Error('User is not defined');
    }
    const [response] = await Promise.all([
      waitForResponseFromMethodGet({ page, url: USERS_PATH }),
      dashboardPage.viewUserDetails(userId),
    ]);
    const responseBody = await response.json();

    expect(response.status()).toBe(200);
    await dashboardPage.verifyUserDetails(responseBody);
  });
});
