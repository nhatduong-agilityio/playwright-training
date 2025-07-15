import { test as base } from '@playwright/test';
import { LoginPage } from '@/pages';

interface PageFixtures {
  loginPage: LoginPage;
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
});
