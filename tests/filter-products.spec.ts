import { test, expect } from '../fixtures/authenticate';
import { PRODUCT_NAMES } from '../constants/products';

const ALL_PRODUCTS = [
  PRODUCT_NAMES.BACKPACK,
  PRODUCT_NAMES.BIKE_LIGHT,
  PRODUCT_NAMES.BOLT_TSHIRT,
  PRODUCT_NAMES.FLEECE_JACKET,
  PRODUCT_NAMES.ONESIE,
  PRODUCT_NAMES.RED_TSHIRT,
];

const PRODUCT_PRICES = {
  [PRODUCT_NAMES.BACKPACK]: 29.99,
  [PRODUCT_NAMES.BIKE_LIGHT]: 9.99,
  [PRODUCT_NAMES.BOLT_TSHIRT]: 15.99,
  [PRODUCT_NAMES.FLEECE_JACKET]: 49.99,
  [PRODUCT_NAMES.ONESIE]: 7.99,
  [PRODUCT_NAMES.RED_TSHIRT]: 15.99,
};

test.describe('Filter Products in Inventory', () => {
  test('That verify user can filter products by Name (A to Z)', async ({
    page,
    inventoryPage,
  }) => {
    // Select Name (A to Z)
    await page.getByRole('combobox').selectOption('az');
    // Get product names in order
    const productNames = await inventoryPage.getProductNamesInOrder();
    const expected = [...ALL_PRODUCTS].sort();
    expect(productNames).toEqual(expected);
  });

  test('That verify user can filter products by Name (Z to A)', async ({
    page,
    inventoryPage,
  }) => {
    // Select Name (Z to A)
    await page.getByRole('combobox').selectOption('za');
    // Get product names in order
    const productNames = await inventoryPage.getProductNamesInOrder();
    const expected = [...ALL_PRODUCTS].sort().reverse();
    expect(productNames).toEqual(expected);
  });

  test('That verify user can filter products by Price (low to high)', async ({
    page,
    inventoryPage,
  }) => {
    // Select Price (low to high)
    await page.getByRole('combobox').selectOption('lohi');
    // Get product names in order
    const productNames = await inventoryPage.getProductNamesInOrder();
    const expected = [...ALL_PRODUCTS].sort(
      (a, b) => PRODUCT_PRICES[a] - PRODUCT_PRICES[b]
    );
    expect(productNames).toEqual(expected);
  });

  test('That verify user can filter products by Price (high to low)', async ({
    page,
    inventoryPage,
  }) => {
    // Select Price (high to low)
    await page.getByRole('combobox').selectOption('hilo');
    // Get product names in order
    const productNames = await inventoryPage.getProductNamesInOrder();
    const expected = [...ALL_PRODUCTS].sort(
      (a, b) => PRODUCT_PRICES[b] - PRODUCT_PRICES[a]
    );
    expect(productNames).toEqual(expected);
  });
});
