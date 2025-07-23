import { USERS_PATH } from '@/constants';
import { test } from '@/fixtures';
import { waitForResponseFromMethodGet } from '@/utils';
import { expect } from '@playwright/test';

const FIELDS: Array<
  'id' | 'email' | 'username' | 'name' | 'created' | 'updated'
> = ['id', 'email', 'username', 'name', 'created', 'updated'];

test.describe('Sort User Records', () => {
  test.beforeEach(async ({ userContext, dashboardPage }) => {
    await test.step('Go to dashboard', async () => {
      await dashboardPage.goto();
      await dashboardPage.verifyAmOnDashboardPage();
    });

    await test.step('Verify users are created', async () => {
      await dashboardPage.refreshTable();

      for (const user of userContext) {
        await dashboardPage.verifyUserIsCreated(user.email);
      }
    });
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
