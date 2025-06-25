import { test, expect } from '@/fixtures/pages';
import { PRODUCT_NAMES } from '@/constants';

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
    await test.step('Select Name (A to Z)', async () => {
      await page.getByRole('combobox').selectOption('az');
    });
    await test.step('Get and verify product names in order', async () => {
      const productNames = await inventoryPage.getProductNamesInOrder();
      const expected = [...ALL_PRODUCTS].sort();
      expect(productNames).toEqual(expected);
    });
  });

  test('That verify user can filter products by Name (Z to A)', async ({
    page,
    inventoryPage,
  }) => {
    await test.step('Select Name (Z to A)', async () => {
      await page.getByRole('combobox').selectOption('za');
    });
    await test.step('Get and verify product names in order', async () => {
      const productNames = await inventoryPage.getProductNamesInOrder();
      const expected = [...ALL_PRODUCTS].sort().reverse();
      expect(productNames).toEqual(expected);
    });
  });

  test('That verify user can filter products by Price (low to high)', async ({
    page,
    inventoryPage,
  }) => {
    await test.step('Select Price (low to high)', async () => {
      await page.getByRole('combobox').selectOption('lohi');
    });
    await test.step('Get and verify product names in order', async () => {
      const productNames = await inventoryPage.getProductNamesInOrder();
      const expected = [...ALL_PRODUCTS].sort(
        (a, b) => PRODUCT_PRICES[a] - PRODUCT_PRICES[b]
      );
      expect(productNames).toEqual(expected);
    });
  });

  test('That verify user can filter products by Price (high to low)', async ({
    page,
    inventoryPage,
  }) => {
    await test.step('Select Price (high to low)', async () => {
      await page.getByRole('combobox').selectOption('hilo');
    });
    await test.step('Get and verify product names in order', async () => {
      const productNames = await inventoryPage.getProductNamesInOrder();
      const expected = [...ALL_PRODUCTS].sort(
        (a, b) => PRODUCT_PRICES[b] - PRODUCT_PRICES[a]
      );
      expect(productNames).toEqual(expected);
    });
  });
});
