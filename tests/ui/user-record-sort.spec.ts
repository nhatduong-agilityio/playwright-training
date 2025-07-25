import { USERS_PATH } from '@/constants';
import { usersFixture as test } from '@/fixtures';
import { waitForResponseFromMethodGet } from '@/utils';
import { expect } from '@playwright/test';

const FIELDS: Array<
  'id' | 'email' | 'username' | 'name' | 'created' | 'updated'
> = ['id', 'email', 'username', 'name', 'created', 'updated'];

test.describe('Sort User Records', () => {
  test.beforeEach(async ({ seededUsers, dashboardPage }) => {
    await test.step('Go to dashboard', async () => {
      await dashboardPage.goto();
      await dashboardPage.expectOnDashboard();
    });

    await test.step('Verify users are created', async () => {
      await dashboardPage.refreshButton.click();
      for (const user of seededUsers) {
        await dashboardPage.expectRowData('email', user.email, user);
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
          dashboardPage.sortAndExpect(field, 'asc'),
        ]);
        expect(getPromiseAsc.status()).toBe(200);
      });

      await test.step(`Sort users by ${field} column in descending order`, async () => {
        // Sort descending
        const [getPromiseDesc] = await Promise.all([
          waitForResponseFromMethodGet({ page, url: USERS_PATH }),
          dashboardPage.sortAndExpect(field, 'desc'),
        ]);
        expect(getPromiseDesc.status()).toBe(200);
      });
    });
  });
});
