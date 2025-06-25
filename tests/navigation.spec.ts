import { test, expect } from '../fixtures/pages';
import { PRODUCT_NAMES } from '../constants';

test.describe('Inventory Navigation', () => {
  test('That verify user is able to navigate to all sidebar items and reset app state', async ({
    page,
    inventoryPage,
  }) => {
    await test.step('Open sidebar and navigate to About', async () => {
      await inventoryPage.openSidebar();
      await page.getByRole('link', { name: /about/i }).click();
      await expect(page).toHaveURL(/saucelabs\.com/);
      await expect(
        page.getByText('Build apps users love with AI-driven insights')
      ).toBeVisible();
      await page.goBack();
    });

    await test.step('Open sidebar and navigate to All Items', async () => {
      await inventoryPage.openSidebar();
      await page.getByRole('link', { name: /all items/i }).click();
      await inventoryPage.closeSidebar();
      await inventoryPage.verifyPageLoaded();
    });

    await test.step('Add item to cart, reset app state, and verify cart is empty', async () => {
      await inventoryPage.addProductToCartByName(PRODUCT_NAMES.FLEECE_JACKET);
      await expect(page.locator('.shopping_cart_badge')).toBeVisible();
      await inventoryPage.resetAppState();
      await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
    });
  });
});
