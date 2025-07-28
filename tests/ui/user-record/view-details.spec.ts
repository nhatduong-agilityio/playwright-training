import { USERS_PATH } from '@/constants';
import { usersFixture as test } from '@/fixtures';
import { User } from '@/types';
import { waitForResponseFromMethodGet } from '@/utils';
import { expect } from '@playwright/test';

test.describe('View User Details', () => {
  test.beforeEach(async ({ seededUsers, tablePage, dashboardPage }) => {
    await test.step('Go to dashboard', async () => {
      await dashboardPage.goto();
      await dashboardPage.expectOnDashboard();
    });

    await test.step('Refresh table', async () => {
      await dashboardPage.refreshButton.click();
      await tablePage.expectRowData(
        'email',
        seededUsers[0].email,
        seededUsers[0]
      );
    });
  });

  test.afterEach(async ({ dashboardPage }) => {
    await dashboardPage.closeUserForm();
  });

  test('That verify user can view details of an existing user', async ({
    dashboardPage,
    tablePage,
    seededUsers,
    page,
  }) => {
    let userDetail: User | undefined;

    await test.step('View user details', async () => {
      const [response] = await Promise.all([
        waitForResponseFromMethodGet({ page, url: USERS_PATH }),
        tablePage.openRowDetails('id', seededUsers[0].id!),
      ]);
      userDetail = await response.json();
      expect(response.status()).toBe(200);
    });

    await test.step('Verify user details', async () => {
      await dashboardPage.expectUserDetails(userDetail!);
    });
  });
});
