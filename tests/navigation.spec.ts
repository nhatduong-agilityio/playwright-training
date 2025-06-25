import { test, expect } from '../fixtures/pages';
import { PRODUCT_NAMES } from '../constants';

test.describe('Inventory Navigation', () => {
  test('That verify user is able to navigate to all sidebar items and reset app state', async ({
    page,
    inventoryPage,
  }) => {
    // Step 2: Open sidebar and navigate to About
    await inventoryPage.openSidebar();
    await page.getByRole('link', { name: /about/i }).click();
    await expect(page).toHaveURL(/saucelabs\.com/);
    await expect(
      page.getByText('Build apps users love with AI-driven insights')
    ).toBeVisible();
    await page.goBack();

    // Step 3: Open sidebar and navigate to All Items
    await inventoryPage.openSidebar();
    await page.getByRole('link', { name: /all items/i }).click();
    await inventoryPage.closeSidebar();
    await inventoryPage.verifyPageLoaded();

    // Step 4: Add an item to cart, open sidebar, click Reset App State
    await inventoryPage.addProductToCartByName(PRODUCT_NAMES.FLEECE_JACKET);
    await expect(page.locator('.shopping_cart_badge')).toBeVisible();
    await inventoryPage.resetAppState();
    // Cart badge should disappear (cart is emptied)
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });
});
