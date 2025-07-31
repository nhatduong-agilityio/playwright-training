import { USERS_PATH } from '@/constants';
import { test } from '@/fixtures';
import { User } from '@/types';
import { waitForResponseFromMethodGet } from '@/utils';
import { expect } from '@playwright/test';

const KEYS: Array<'email' | 'username' | 'name'> = [
  'email',
  'username',
  'name',
];

test.describe('Search User Records', () => {
  test.beforeEach(async ({ seededUsers, tablePage, dashboardPage }) => {
    await test.step('Go to dashboard', async () => {
      await dashboardPage.goto();
      await dashboardPage.expectOnDashboard();
    });

    await test.step('Verify users are created', async () => {
      await dashboardPage.refreshButton.click();
      await tablePage.waitForTableReady();

      for (const user of seededUsers) {
        await tablePage.expectRowData('id', user.id!, user);
      }
    });
  });

  test.afterEach(async ({ dashboardPage }) => {
    await dashboardPage.clearSearchButton.click();
  });

  KEYS.forEach(key => {
    test(`That verify user can search users by ${key}`, async ({
      dashboardPage,
      tablePage,
      seededUsers,
      page,
    }) => {
      let users: User[] = [];
      const keyword = seededUsers[0][key]!;

      await test.step(`Search users by ${key}`, async () => {
        const [searchResponse] = await Promise.all([
          waitForResponseFromMethodGet({ page, url: USERS_PATH }),
          dashboardPage.searchRecords(keyword),
        ]);
        await expect(searchResponse.status()).toBe(200);

        const responseBody = await searchResponse.json();
        users = responseBody.items;
      });

      await test.step('Verify users are found', async () => {
        await tablePage.expectRowData(key, keyword, users[0]);
      });
    });
  });
});
