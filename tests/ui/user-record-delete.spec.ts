import { createUserAction } from '@/actions';
import { USERS_PATH, VALID_USER } from '@/constants';
import { test } from '@/fixtures';
import { waitForResponseFromMethodDelete } from '@/utils';
import { expect } from '@playwright/test';

test.describe('Delete User Record', () => {
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

  test.afterEach(async ({ dashboardPage }) => {
    if (userId) {
      await dashboardPage.refreshTable();
      userId = undefined;
    }
  });

  test('That verify user can delete an existing user record', async ({
    dashboardPage,
    page,
  }) => {
    const [deleteResponse] = await Promise.all([
      waitForResponseFromMethodDelete({ page, url: USERS_PATH, id: userId! }),
      dashboardPage.deleteUserRecord(userId!),
    ]);

    expect(deleteResponse.status()).toBe(204);
    await dashboardPage.verifyUserIsDeleted(userId!);
    await dashboardPage.verifyToastMessageVisible(
      'Successfully deleted the selected record.'
    );
  });
});
