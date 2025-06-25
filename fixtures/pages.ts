import { test as base, expect } from '@playwright/test';
import { InventoryPage, CartPage, CheckoutPage } from '../pages';
import { INVENTORY_URL } from '../constants';

interface PageFixtures {
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
}

const test = base.extend<PageFixtures>({
  inventoryPage: async ({ page }, use) => {
    const inventoryPage = new InventoryPage(page);

    // Navigate to inventory page since all authenticated tests start here
    await page.goto(INVENTORY_URL);
    await inventoryPage.verifyPageLoaded();

    await use(inventoryPage);
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
});

export { test, expect };
