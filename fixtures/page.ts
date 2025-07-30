import { APIRequestContext, APIResponse, Response, } from '@playwright/test';
import { test  } from 'playwright-bdd';
import { LoginPage, DashboardPage, TablePage } from '@/pages';
import { extractAccessToken } from '@/utils';
import { BASE_URL } from '@/constants';
import { User } from '@/types';

// ** Ctx: cross step context ** //
interface Ctx {
  response?: APIResponse | Response;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  responseBody?: any;
  user?: User;
  userId?: string;
  email?: string;
  seededUsers?: User[];
}

interface PageFixtures {
  apiContext: APIRequestContext;
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  tablePage: TablePage;
  ctx: Ctx;
}

/**
 * Extends the base Playwright test with custom page object fixtures.
 */
export const base = test.extend<PageFixtures>({
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
  /**
   * Provides a TablePage instance for tests.
   */
  tablePage: async ({ page }, use) => {
    await use(new TablePage(page));
  },
  /**
   * Provides a shared context for passing data between test steps.
   */
  ctx: async ({}, use) => {
    const ctx: Ctx = {};
    await use(ctx);
  },
});

