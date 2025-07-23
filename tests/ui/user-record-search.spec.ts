import { USERS_PATH } from '@/constants';
import { test } from '@/fixtures';
import { UserRecord } from '@/types';
import { waitForResponseFromMethodGet } from '@/utils';
import { expect } from '@playwright/test';

const KEYS: Array<'email' | 'username' | 'name'> = [
  'email',
  'username',
  'name',
];

test.describe('Search User Records', () => {
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

  test.afterEach(async ({ dashboardPage }) => {
    await dashboardPage.clearSearch();
  });

  KEYS.forEach(key => {
    test(`That verify user can search users by ${key}`, async ({
      dashboardPage,
      userContext,
      page,
    }) => {
      let users: UserRecord[] = [];
      const keyword = userContext[0][key]!;

      await test.step(`Search users by ${key}`, async () => {
        const [searchResponse] = await Promise.all([
          waitForResponseFromMethodGet({ page, url: USERS_PATH }),
          dashboardPage.searchUsersByKeyword(keyword),
        ]);
        await expect(searchResponse.status()).toBe(200);

        const responseBody = await searchResponse.json();
        users = responseBody.items;
      });

      await test.step('Verify users are found', async () => {
        await dashboardPage.verifySearchResultsContainKeyword(users, keyword);
      });
    });
  });
});
