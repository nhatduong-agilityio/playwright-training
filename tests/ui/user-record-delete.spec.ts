import { USERS_PATH } from '@/constants';
import { test } from '@/fixtures';
import { waitForResponseFromMethodDelete } from '@/utils';
import { expect } from '@playwright/test';

test.describe('Delete User Record', () => {
  test.beforeEach(async ({ dashboardPage, userContext }) => {
    await test.step('Go to dashboard', async () => {
      await dashboardPage.goto();
      await dashboardPage.verifyAmOnDashboardPage();
    });

    await test.step('Refresh table', async () => {
      await dashboardPage.refreshTable();
      await dashboardPage.verifyUserIsCreated(userContext[0].email);
    });
  });

  test.afterEach(async ({ dashboardPage }) => {
    await dashboardPage.refreshTable();
  });

  test('That verify user can delete an existing user record', async ({
    dashboardPage,
    userContext,
    page,
  }) => {
    await test.step('Delete user record', async () => {
      const [deleteResponse] = await Promise.all([
        waitForResponseFromMethodDelete({
          page,
          url: USERS_PATH,
          id: userContext[0].id!,
        }),
        dashboardPage.deleteUserRecord(userContext[0].id!),
      ]);
      expect(deleteResponse.status()).toBe(204);
    });

    await test.step('Verify user record is deleted', async () => {
      await dashboardPage.verifyUserIsDeleted(userContext[0].id!);
      await dashboardPage.verifyToastMessageVisible(
        'Successfully deleted the selected record.'
      );
    });
  });
});
