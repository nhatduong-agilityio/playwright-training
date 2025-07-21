import * as path from 'path';
import { test as setup } from '@/fixtures';
import { USERS } from '@/constants';

const authFile = path.join(__dirname, './user.json');

setup(
  'Setup authentication',
  {
    tag: '@setup_authentication',
  },
  async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.verifyAmOnLoginPage();
    await loginPage.loginAs(USERS.test.email, USERS.test.password);
    await loginPage.verifyLoginSuccess();

    // Save auth state
    await page.context().storageState({ path: authFile });
  }
);
