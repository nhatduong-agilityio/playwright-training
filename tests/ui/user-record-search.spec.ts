import { deleteUserAction } from '@/actions';
import { USERS_PATH } from '@/constants';
import { test } from '@/fixtures';
import { UserRecord } from '@/types';
import { createMultipleUsers, waitForResponseFromMethodGet } from '@/utils';
import { expect } from '@playwright/test';

const KEYS: Array<'email' | 'username' | 'name'> = [
  'email',
  'username',
  'name',
];

test.describe('Search User Records', () => {
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

  test.afterEach(async ({ apiContext, dashboardPage }) => {
    await dashboardPage.clearSearch();

    for (const user of createdUsers) {
      await deleteUserAction(apiContext, user.id!);
    }
    createdUsers = [];
  });

  KEYS.forEach(key => {
    test(`That verify user can search users by ${key}`, async ({
      dashboardPage,
      page,
    }) => {
      const keyword = createdUsers[0][key]!;

      const [searchResponse] = await Promise.all([
        waitForResponseFromMethodGet({ page, url: USERS_PATH }),
        dashboardPage.searchUsersByKeyword(keyword),
      ]);
      await expect(searchResponse.status()).toBe(200);

      const responseBody = await searchResponse.json();
      const users: UserRecord[] = responseBody.items;

      await dashboardPage.verifySearchResultsContainKeyword(users, keyword);
    });
  });
});

test.describe('Search User Records with Special Characters', () => {
  let createdUsers: UserRecord[] = [];
  const specialString = '!@#$%^&*()';

  test.beforeEach(async ({ apiContext, dashboardPage }) => {
    await dashboardPage.goto();
    await dashboardPage.verifyAmOnDashboardPage();

    createdUsers = await createMultipleUsers(apiContext, 1, specialString);

    await dashboardPage.refreshTable();

    await test.step('Verify users are created', async () => {
      for (const user of createdUsers) {
        await dashboardPage.verifyUserIsCreated(user.email);
      }
    });
  });

  test.afterEach(async ({ apiContext, dashboardPage }) => {
    await dashboardPage.clearSearch();

    for (const user of createdUsers) {
      await deleteUserAction(apiContext, user.id!);
    }
    createdUsers = [];
  });

  test('That verify user can search users by username with special characters', async ({
    dashboardPage,
    page,
  }) => {
    const keyword = specialString;

    const [searchResponse] = await Promise.all([
      waitForResponseFromMethodGet({ page, url: USERS_PATH }),
      dashboardPage.searchUsersByKeyword(keyword),
    ]);
    await expect(searchResponse.status()).toBe(200);

    const responseBody = await searchResponse.json();

    const users: UserRecord[] = responseBody.items;

    await dashboardPage.verifySearchResultsContainKeyword(users, keyword);
  });
});
