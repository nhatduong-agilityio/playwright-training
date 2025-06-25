import { test as base, expect } from '@playwright/test';
import { InventoryPage, CartPage, CheckoutPage } from '@/pages';
import { INVENTORY_URL } from '@/constants';

/**
 * Custom Playwright fixtures for page objects.
 * Provides InventoryPage, CartPage, and CheckoutPage instances for tests.
 */
interface PageFixtures {
  /** Inventory page object */
  inventoryPage: InventoryPage;
  /** Cart page object */
  cartPage: CartPage;
  /** Checkout page object */
  checkoutPage: CheckoutPage;
}

/**
 * Extends the base test with custom page object fixtures.
 * - Navigates to the inventory page and provides InventoryPage instance.
 * - Provides CartPage and CheckoutPage instances.
 */
const test = base.extend<PageFixtures>({
  /**
   * InventoryPage fixture.
   * Navigates to the inventory page and provides an InventoryPage instance.
   */
  inventoryPage: async ({ page }, use) => {
    const inventoryPage = new InventoryPage(page);
    // Navigate to inventory page since all authenticated tests start here
    await page.goto(INVENTORY_URL);
    await inventoryPage.verifyPageLoaded();
    await use(inventoryPage);
  },
  /**
   * CartPage fixture.
   * Provides a CartPage instance.
   */
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  /**
   * CheckoutPage fixture.
   * Provides a CheckoutPage instance.
   */
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
});

export { test, expect };
