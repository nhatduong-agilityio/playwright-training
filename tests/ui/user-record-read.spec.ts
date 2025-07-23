import { createUserAction, deleteUserAction } from '@/actions';
import { USERS_PATH, VALID_USER } from '@/constants';
import { test } from '@/fixtures';
import { UserRecord } from '@/types';
import { waitForResponseFromMethodGet } from '@/utils';
import { expect } from '@playwright/test';

test.describe('Read User Record', () => {
  test.beforeEach(async ({ userContext, dashboardPage }) => {
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
    await dashboardPage.closeFormContainer();
  });

  test('That verify user can view details of an existing user', async ({
    dashboardPage,
    userContext,
    page,
  }) => {
    let userDetail: UserRecord | undefined;

    await test.step('View user details', async () => {
      const [response] = await Promise.all([
        waitForResponseFromMethodGet({ page, url: USERS_PATH }),
        dashboardPage.viewUserDetails(userContext[0].id!),
      ]);
      userDetail = await response.json();
      expect(response.status()).toBe(200);
    });

    await test.step('Verify user details', async () => {
      await dashboardPage.verifyUserDetails(userDetail!);
    });
  });
});
