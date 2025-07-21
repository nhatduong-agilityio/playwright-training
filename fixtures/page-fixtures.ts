import { APIRequestContext, test as base } from '@playwright/test';
import { LoginPage, DashboardPage } from '@/pages';
import { extractAccessToken } from '@/utils';
import { BASE_URL } from '@/constants';

interface PageFixtures {
  apiContext: APIRequestContext;
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
}

/**
 * Extends the base Playwright test with custom page object fixtures.
 */
export const test = base.extend<PageFixtures>({
  /**
   * Provides a LoginPage instance for tests.
   */
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  /**
   * Provides a DashboardPage instance for tests.
   */
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  /**
   * Provides an APIRequestContext instance with an access token for tests.
   *
   * The context is automatically disposed after the test.
   */
  apiContext: async ({ playwright }, use) => {
    const token = extractAccessToken();
    const context = await playwright.request.newContext({
      baseURL: BASE_URL,
      extraHTTPHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    await use(context);
    await context.dispose();
  },
});
