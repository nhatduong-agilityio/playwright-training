import { test } from '../fixtures/pages';
import { PRODUCT_NAMES } from '../constants/products';

test.describe('Add to Cart', () => {
  test('That verify user is able to add multiple products to cart and view them in cart page', async ({
    inventoryPage,
    cartPage,
  }) => {
    // Step 2: Add multiple products to cart using product names
    const productsToAdd = [PRODUCT_NAMES.BACKPACK, PRODUCT_NAMES.BIKE_LIGHT];

    // Verify products exist before adding
    await inventoryPage.verifyMultipleProductsExist(productsToAdd);

    // Add products to cart by name
    await inventoryPage.addMultipleProductsToCart(productsToAdd);

    // Verify cart badge shows correct count
    await inventoryPage.verifyCartBadge('2');

    // Verify remove buttons are visible for added products
    await inventoryPage.verifyRemoveButtonsForProducts(productsToAdd);

    // Step 3: Navigate to cart and verify items
    await inventoryPage.navigateToCart();
    await cartPage.verifyPageLoaded();

    // Verify cart items using product names
    await cartPage.verifyMultipleCartItemsExist(productsToAdd);
  });

  test('That verify user can add and remove specific products', async ({
    inventoryPage,
  }) => {
    // Add product by name
    await inventoryPage.addProductToCartByName(PRODUCT_NAMES.FLEECE_JACKET);
    await inventoryPage.verifyCartBadge('1');
    await inventoryPage.verifyRemoveButtonForProduct(
      PRODUCT_NAMES.FLEECE_JACKET
    );

    // Remove product from inventory page
    await inventoryPage.removeProductFromCartByName(
      PRODUCT_NAMES.FLEECE_JACKET
    );
    await inventoryPage.verifyCartBadgeNotVisible();
    await inventoryPage.verifyAddToCartButtonForProduct(
      PRODUCT_NAMES.FLEECE_JACKET
    );
  });
});
