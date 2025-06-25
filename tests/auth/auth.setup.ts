import { test as setup } from '@playwright/test';
import { LoginPage, InventoryPage } from '@/pages';
import { USERS } from '@/constants';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.goto();

  await setup.step('Fill in valid credentials and submit', async () => {
    await loginPage.login(USERS.STANDARD);
  });

  await setup.step('Verify successful login', async () => {
    await inventoryPage.verifyPageLoaded();
  });

  await page.context().storageState({ path: authFile });
});
