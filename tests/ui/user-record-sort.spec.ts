import { createUserAction, deleteUserAction } from '@/actions';
import { USERS_PATH, VALID_USER } from '@/constants';
import { test } from '@/fixtures';
import { UserRecord } from '@/types';
import { createMultipleUsers, waitForResponseFromMethodGet } from '@/utils';
import { expect } from '@playwright/test';

const FIELDS: Array<
  'id' | 'email' | 'username' | 'name' | 'created' | 'updated'
> = ['id', 'email', 'username', 'name', 'created', 'updated'];

test.describe('Sort Users', () => {
  let createdUsers: UserRecord[] = [];

  test.beforeEach(async ({ apiContext, dashboardPage }) => {
    await dashboardPage.goto();
    await dashboardPage.verifyAmOnDashboardPage();

    // Create three test users
    createdUsers = await createMultipleUsers(apiContext, 3);

    await dashboardPage.refreshTable();

    await test.step('Verify users are created', async () => {
      for (const user of createdUsers) {
        await dashboardPage.verifyUserIsCreated(user.email);
      }
    });
  });

  test.afterEach(async ({ apiContext }) => {
    for (const user of createdUsers) {
      await deleteUserAction(apiContext, user.id!);
    }
    createdUsers = [];
  });

  // Parameterized validation tests
  FIELDS.forEach(field => {
    test(`That verify user can sort users by ${field} column`, async ({
      dashboardPage,
      page,
    }) => {
      await test.step(`Sort users by ${field} column in ascending order`, async () => {
        // Sort ascending
        const [getPromiseAsc] = await Promise.all([
          waitForResponseFromMethodGet({ page, url: USERS_PATH }),
          dashboardPage.sortAndVerify(field, 'asc'),
        ]);
        expect(getPromiseAsc.status()).toBe(200);
      });

      await test.step(`Sort users by ${field} column in descending order`, async () => {
        // Sort descending
        const [getPromiseDesc] = await Promise.all([
          waitForResponseFromMethodGet({ page, url: USERS_PATH }),
          dashboardPage.sortAndVerify(field, 'desc'),
        ]);
        expect(getPromiseDesc.status()).toBe(200);
      });
    });
  });
});
