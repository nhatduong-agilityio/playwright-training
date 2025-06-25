import { test } from '@/fixtures/pages';
import { PRODUCT_NAMES, CHECKOUT_USER_INFO } from '@/constants';

const PRODUCTS = [PRODUCT_NAMES.BACKPACK, PRODUCT_NAMES.BIKE_LIGHT];

const FULL_INFO = {
  firstName: CHECKOUT_USER_INFO.FIRST_NAME,
  lastName: CHECKOUT_USER_INFO.LAST_NAME,
  postalCode: CHECKOUT_USER_INFO.POSTAL_CODE,
};

const requiredFields = ['firstName', 'lastName', 'postalCode'] as const;
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
  test.beforeEach(async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.addProductsToCart(PRODUCTS);
    await inventoryPage.navigateToCart();
    await cartPage.verifyPageLoaded();
    await cartPage.proceedToCheckout();
    await checkoutPage.verifyStepOneLoaded();
  });

  test('That verify user cannot continue checkout with all information fields empty', async ({
    checkoutPage,
  }) => {
    await test.step('Try to continue with all fields empty', async () => {
      await checkoutPage.continue();
    });
    await test.step('Verify error message for missing first name', async () => {
      await checkoutPage.verifyErrorMessage('First Name is required');
    });
  });

  for (const { filled, expectedError, missingField } of missingFieldCases) {
    test(`That verify user cannot continue checkout with missing required field: ${missingField}`, async ({
      checkoutPage,
    }) => {
      await test.step(`Fill info with missing ${missingField}`, async () => {
        await checkoutPage.fillInfo(filled);
      });
      await test.step('Try to continue', async () => {
        await checkoutPage.continue();
      });
      await test.step('Verify error message', async () => {
        await checkoutPage.verifyErrorMessage(expectedError);
      });
    });
  }

  test('That verify user is able to complete checkout with multiple products', async ({
    checkoutPage,
    inventoryPage,
  }) => {
    await test.step('Fill in all required info', async () => {
      await checkoutPage.fillInfo(FULL_INFO);
    });
    await test.step('Continue to overview', async () => {
      await checkoutPage.continue();
      await checkoutPage.verifyCheckoutOverviewPageLoaded();
      await checkoutPage.verifyCartItemsCount(PRODUCTS.length);
      await checkoutPage.verifyPaymentAndShippingInfo();
    });
    await test.step('Finish checkout and verify complete', async () => {
      await checkoutPage.finish();
      await checkoutPage.verifyCompleteLoaded();
      await inventoryPage.verifyCartBadgeNotVisible();
    });
  });
});
