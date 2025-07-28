import { USERS_PATH } from '@/constants';
import { usersFixture as test } from '@/fixtures';
import { waitForResponseFromMethodDelete } from '@/utils';
import { expect } from '@playwright/test';

test.describe('Delete User Record', () => {
  test.beforeEach(async ({ dashboardPage, tablePage, seededUsers }) => {
    await test.step('Go to dashboard', async () => {
      await dashboardPage.goto();
      await dashboardPage.expectOnDashboard();
      await tablePage.waitForTableReady();
    });

    await test.step('Refresh table', async () => {
      await dashboardPage.refreshButton.click();
      await tablePage.waitForTableReady();
      // Verify first seeded user is present
      await tablePage.expectRowData(
        'email',
        seededUsers[0].email,
        seededUsers[0]
      );
    });
  });

  test.afterEach(async ({ dashboardPage, tablePage }) => {
    await dashboardPage.refreshButton.click();
    await tablePage.waitForTableReady();
  });

  test('That verify user can delete an existing user record', async ({
    dashboardPage,
    tablePage,
    seededUsers,
    page,
  }) => {
    await test.step('Delete user record', async () => {
      const [deleteResponse] = await Promise.all([
        waitForResponseFromMethodDelete({
          page,
          url: USERS_PATH,
          id: seededUsers[0].id!,
        }),
        tablePage.deleteRowSelected('id', seededUsers[0].id!),
      ]);
      expect(deleteResponse.status()).toBe(204);
    });

    await test.step('Verify user record is deleted', async () => {
      await dashboardPage.refreshButton.click();
      await tablePage.waitForTableReady();
      await tablePage.expectRowNotVisible('id', seededUsers[0].id!);
      await dashboardPage.expectToast(
        'Successfully deleted the selected record.'
      );
    });
  });
});
