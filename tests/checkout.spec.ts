import { test } from '@playwright/test';
import { LoginPage, InventoryPage, CartPage, CheckoutPage } from '../pages';
import { PRODUCT_NAMES, CHECKOUT_USER_INFO } from '../constants';

const PRODUCTS = [PRODUCT_NAMES.BACKPACK, PRODUCT_NAMES.BIKE_LIGHT];

test.describe('Checkout Products', () => {
  test('That verify user cannot continue checkout with all information fields empty', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.login();
    await inventoryPage.verifyPageLoaded();
    await inventoryPage.addProductsToCart(inventoryPage, PRODUCTS);
    await inventoryPage.navigateToCart();
    await cartPage.verifyPageLoaded();
    await cartPage.proceedToCheckout();
    await checkoutPage.verifyStepOneLoaded();
    await checkoutPage.continue();
    await checkoutPage.verifyErrorMessage('First Name is required');
  });

  test('That verify user cannot continue checkout with missing required fields', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.login();
    await inventoryPage.verifyPageLoaded();
    await inventoryPage.addProductsToCart(inventoryPage, PRODUCTS);
    await inventoryPage.navigateToCart();
    await cartPage.verifyPageLoaded();
    await cartPage.proceedToCheckout();
    await checkoutPage.verifyStepOneLoaded();

    // Only First Name
    await checkoutPage.fillInfo({ firstName: CHECKOUT_USER_INFO.FIRST_NAME });
    await checkoutPage.continue();
    await checkoutPage.verifyErrorMessage('Last Name is required');
    await checkoutPage.fillInfo({ firstName: '' });

    // Only Last Name
    await checkoutPage.fillInfo({ lastName: CHECKOUT_USER_INFO.LAST_NAME });
    await checkoutPage.continue();
    await checkoutPage.verifyErrorMessage('First Name is required');
    await checkoutPage.fillInfo({ lastName: '' });

    // Only Postal Code
    await checkoutPage.fillInfo({ postalCode: CHECKOUT_USER_INFO.POSTAL_CODE });
    await checkoutPage.continue();
    await checkoutPage.verifyErrorMessage('First Name is required');
    await checkoutPage.fillInfo({ postalCode: '' });

    // First Name + Last Name
    await checkoutPage.fillInfo({
      firstName: CHECKOUT_USER_INFO.FIRST_NAME,
      lastName: CHECKOUT_USER_INFO.LAST_NAME,
    });
    await checkoutPage.continue();
    await checkoutPage.verifyErrorMessage('Postal Code is required');
    await checkoutPage.fillInfo({ firstName: '', lastName: '' });

    // First Name + Postal Code
    await checkoutPage.fillInfo({
      firstName: CHECKOUT_USER_INFO.FIRST_NAME,
      postalCode: CHECKOUT_USER_INFO.POSTAL_CODE,
    });
    await checkoutPage.continue();
    await checkoutPage.verifyErrorMessage('Last Name is required');
    await checkoutPage.fillInfo({ firstName: '', postalCode: '' });

    // Last Name + Postal Code
    await checkoutPage.fillInfo({
      lastName: CHECKOUT_USER_INFO.LAST_NAME,
      postalCode: CHECKOUT_USER_INFO.POSTAL_CODE,
    });
    await checkoutPage.continue();
    await checkoutPage.verifyErrorMessage('First Name is required');
  });

  test('That verify user is able to complete checkout with multiple products', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Step 1: Login
    await loginPage.login();
    await inventoryPage.verifyPageLoaded();

    // Step 2: Add products to cart
    await inventoryPage.addProductsToCart(inventoryPage, PRODUCTS);

    // Step 3: Go to cart and verify items
    await inventoryPage.navigateToCart();
    await cartPage.verifyPageLoaded();
    await cartPage.verifyMultipleCartItemsExist(PRODUCTS);

    // Step 4: Checkout
    await cartPage.proceedToCheckout();
    await checkoutPage.verifyStepOneLoaded();

    // Step 5: Fill info and continue
    await checkoutPage.fillInfo({
      firstName: CHECKOUT_USER_INFO.FIRST_NAME,
      lastName: CHECKOUT_USER_INFO.LAST_NAME,
      postalCode: CHECKOUT_USER_INFO.POSTAL_CODE,
    });
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
