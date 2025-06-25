import { test } from '../fixtures/pages';
import { PRODUCT_NAMES } from '../constants/products';

test.describe('Add to Cart', () => {
  test.afterEach(async ({ inventoryPage }) => {
    await inventoryPage.resetAppState();
  });

  test('That verify user is able to add multiple products to cart and view them in cart page', async ({
    page,
    inventoryPage,
    cartPage,
  }) => {
    const productsToAdd = [PRODUCT_NAMES.BACKPACK, PRODUCT_NAMES.BIKE_LIGHT];

    await test.step('Verify products exist before adding', async () => {
      await inventoryPage.verifyMultipleProductsExist(productsToAdd);
    });

    await test.step('Add products to cart by name', async () => {
      await inventoryPage.addMultipleProductsToCart(productsToAdd);
    });

    await test.step('Verify cart badge shows correct count', async () => {
      await inventoryPage.verifyCartBadge('2');
    });

    await test.step('Verify remove buttons are visible for added products', async () => {
      await inventoryPage.verifyRemoveButtonsForProducts(productsToAdd);
    });

    await test.step('Navigate to cart and verify items', async () => {
      await inventoryPage.navigateToCart();
      await cartPage.verifyPageLoaded();
      await cartPage.verifyMultipleCartItemsExist(productsToAdd);
      await page.goBack();
    });
  });

  test('That verify user can add and remove specific products', async ({
    inventoryPage,
  }) => {
    await test.step('Add product by name', async () => {
      await inventoryPage.addProductToCartByName(PRODUCT_NAMES.FLEECE_JACKET);
      await inventoryPage.verifyCartBadge('1');
      await inventoryPage.verifyRemoveButtonForProduct(
        PRODUCT_NAMES.FLEECE_JACKET
      );
    });

    await test.step('Remove product from inventory page', async () => {
      await inventoryPage.removeProductFromCartByName(
        PRODUCT_NAMES.FLEECE_JACKET
      );
      await inventoryPage.verifyCartBadgeNotVisible();
      await inventoryPage.verifyAddToCartButtonForProduct(
        PRODUCT_NAMES.FLEECE_JACKET
      );
    });
  });
});
