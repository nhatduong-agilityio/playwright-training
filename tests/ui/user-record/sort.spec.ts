import { USERS_PATH } from '@/constants';
import { usersFixture as test } from '@/fixtures';
import { waitForResponseFromMethodGet } from '@/utils';
import { expect } from '@playwright/test';

const FIELDS: Array<
  'id' | 'email' | 'username' | 'name' | 'created' | 'updated'
> = ['id', 'email', 'username', 'name', 'created', 'updated'];

test.describe('Sort User Records', () => {
  test.beforeEach(async ({ seededUsers, tablePage, dashboardPage }) => {
    await test.step('Go to dashboard', async () => {
      await dashboardPage.goto();
      await dashboardPage.expectOnDashboard();
      await tablePage.waitForTableReady();
    });

    await test.step('Verify users are created', async () => {
      await dashboardPage.refreshButton.click();
      await tablePage.waitForTableReady();

      for (const user of seededUsers) {
        await tablePage.expectRowData('id', user.id!, user);
      }
    });
  });

  // Parameterized validation tests
  FIELDS.forEach(field => {
    test(`That verify user can sort users by ${field} column`, async ({
      tablePage,
      page,
    }) => {
      await test.step(`Sort users by ${field} column in ascending order`, async () => {
        // Sort ascending
        const [getPromiseAsc] = await Promise.all([
          waitForResponseFromMethodGet({ page, url: USERS_PATH }),
          tablePage.sortByField(field),
        ]);
        await tablePage.expectSortedByField({ field, order: 'asc' });
        expect(getPromiseAsc.status()).toBe(200);
      });

      await test.step(`Sort users by ${field} column in descending order`, async () => {
        // Sort descending
        const [getPromiseDesc] = await Promise.all([
          waitForResponseFromMethodGet({ page, url: USERS_PATH }),
          tablePage.sortByField(field),
        ]);
        await tablePage.expectSortedByField({ field, order: 'desc' });
        expect(getPromiseDesc.status()).toBe(200);
      });
    });
  });
});
