import { User } from '@/types';
import { github2FA } from './github-2fa';
import { createMultipleUsers } from '@/utils';
import { deleteUser } from '@/actions';
import { createBdd } from 'playwright-bdd';

interface UsersFixtures {
  seededUsers: User[];
}

export const test = github2FA.extend<UsersFixtures>({
  /**
   * Seeds the dashboard with three users, and automatically deletes them after use.
   * @param {Object} context - The test context.
   * @param {APIRequestContext} context.apiContext - The API request context.
   * @param {DashboardPage} context.dashboardPage - The dashboard page.
   * @param {Function} use - A callback function to use the seeded users.
   */
  seededUsers: async ({ apiContext, dashboardPage }, use) => {
    const users = await createMultipleUsers(apiContext, 3);

    await use(users);

    for (const user of users) {
      if (user && user.id) {
        await deleteUser(apiContext, user.id);
      }
    }
    await dashboardPage.refreshButton.click();
  },
});

export const { Given, When, Then, Before, After } = createBdd(test);
