import { test } from '../fixtures/authenticate';
import { PRODUCT_NAMES, CHECKOUT_USER_INFO } from '../constants';

const PRODUCTS = [PRODUCT_NAMES.BACKPACK, PRODUCT_NAMES.BIKE_LIGHT];

const FULL_INFO = {
  firstName: CHECKOUT_USER_INFO.FIRST_NAME,
  lastName: CHECKOUT_USER_INFO.LAST_NAME,
  postalCode: CHECKOUT_USER_INFO.POSTAL_CODE,
};

const requiredFields = ['firstName', 'lastName', 'postalCode'];
const errorMessages = {
  firstName: 'First Name is required',
  lastName: 'Last Name is required',
  postalCode: 'Postal Code is required',
};

// Generate test cases for each field missing
const missingFieldCases = requiredFields.map(field => {
  const filled = { ...FULL_INFO };
  delete filled[field];
  return {
    filled,
    expectedError: errorMessages[field],
    missingField: field,
  };
});

test.describe('Checkout Products', () => {
  test('That verify user cannot continue checkout with all information fields empty', async ({
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await inventoryPage.addProductsToCart(PRODUCTS);
    await inventoryPage.navigateToCart();
    await cartPage.verifyPageLoaded();
    await cartPage.proceedToCheckout();
    await checkoutPage.verifyStepOneLoaded();
    await checkoutPage.continue();
    await checkoutPage.verifyErrorMessage('First Name is required');
  });

  for (const { filled, expectedError, missingField } of missingFieldCases) {
    test(`That verify user cannot continue checkout with missing required field: ${missingField}`, async ({
      inventoryPage,
      cartPage,
      checkoutPage,
    }) => {
      await inventoryPage.addProductsToCart(PRODUCTS);
      await inventoryPage.navigateToCart();
      await cartPage.verifyPageLoaded();
      await cartPage.proceedToCheckout();
      await checkoutPage.verifyStepOneLoaded();
      await checkoutPage.fillInfo(filled);
      await checkoutPage.continue();
      await checkoutPage.verifyErrorMessage(expectedError);
    });
  }

  test('That verify user is able to complete checkout with multiple products', async ({
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    // Step 2: Add products to cart
    await inventoryPage.addProductsToCart(PRODUCTS);

    // Step 3: Go to cart and verify items
    await inventoryPage.navigateToCart();
    await cartPage.verifyPageLoaded();
    await cartPage.verifyMultipleCartItemsExist(PRODUCTS);

    // Step 4: Checkout
    await cartPage.proceedToCheckout();
    await checkoutPage.verifyStepOneLoaded();

    // Step 5: Fill info and continue
    await checkoutPage.fillInfo(FULL_INFO);
    await checkoutPage.continue();
    await checkoutPage.verifyCheckoutOverviewPageLoaded();
    await checkoutPage.verifyCartItemsCount(PRODUCTS.length);
    await checkoutPage.verifyPaymentAndShippingInfo();

    // Step 6: Finish and verify complete
    await checkoutPage.finish();
    await checkoutPage.verifyCompleteLoaded();
    await inventoryPage.verifyCartBadgeNotVisible();
  });
});
