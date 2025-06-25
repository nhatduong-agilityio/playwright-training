import { expect, Page, Locator } from '@playwright/test';

/**
 * Page Object Model for the Cart page.
 */
export class CartPage {
  /**
   * Initializes the CartPage with a Playwright Page object.
   * @param page Playwright Page instance
   */
  constructor(readonly page: Page) {}

  /**
   * Asserts that the cart page is loaded by checking the URL and the presence of the "Your Cart" text.
   */
  async verifyPageLoaded() {
    await expect(this.page.getByText('Your Cart')).toBeVisible();
    await expect(this.page).toHaveURL(/.*cart\.html/);
  }

  /**
   * Returns all cart item locators on the cart page.
   */
  async getCartItems() {
    return await this.page.locator('.cart_item').all();
  }

  /**
   * Finds and returns the locator for a cart item by its name. Throws an error if not found.
   * @param productName Name of the product to find
   * @returns Locator for the cart item
   */
  async findCartItemByName(productName: string): Promise<Locator> {
    const cartItems = await this.getCartItems();
    for (const item of cartItems) {
      const nameElement = item.getByTestId('inventory-item-name');
      const actualName = await nameElement.textContent();
      if (
        actualName &&
        actualName.toLowerCase().includes(productName.toLowerCase())
      ) {
        return item;
      }
    }
    throw new Error(`Cart item with name "${productName}" not found`);
  }

  /**
   * Asserts that the cart contains the expected number of items.
   * @param expectedCount Expected number of items
   */
  async verifyCartItemsCount(expectedCount: number) {
    const cartItems = await this.getCartItems();
    await expect(cartItems).toHaveLength(expectedCount);
  }

  /**
   * Asserts that a cart item with the given name exists.
   * @param productName Name of the product
   */
  async verifyCartItemExists(productName: string) {
    const cartItem = await this.findCartItemByName(productName);
    await expect(cartItem.getByTestId('inventory-item-name')).toContainText(
      productName
    );
  }

  /**
   * Asserts that all given products exist in the cart and the count matches.
   * @param productNames Array of product names
   */
  async verifyMultipleCartItemsExist(productNames: string[]) {
    await this.verifyCartItemsCount(productNames.length);
    for (const productName of productNames) {
      await this.verifyCartItemExists(productName);
    }
  }

  /**
   * Removes a cart item by its name.
   * @param productName Name of the product
   */
  async removeCartItemByName(productName: string) {
    const cartItem = await this.findCartItemByName(productName);
    await cartItem.locator('button', { hasText: /remove/i }).click();
  }

  /**
   * Removes multiple cart items by their names.
   * @param productNames Array of product names
   */
  async removeMultipleCartItems(productNames: string[]) {
    for (const productName of productNames) {
      await this.removeCartItemByName(productName);
    }
  }

  /**
   * Asserts that the "Remove" button is visible for the given cart item.
   * @param productName Name of the product
   */
  async verifyRemoveButtonForProduct(productName: string) {
    const cartItem = await this.findCartItemByName(productName);
    await expect(
      cartItem.locator('button', { hasText: /remove/i })
    ).toBeVisible();
  }

  /**
   * Returns the price of the given cart item as a string.
   * @param productName Name of the product
   * @returns Price as string
   */
  async getCartItemPrice(productName: string): Promise<string> {
    const cartItem = await this.findCartItemByName(productName);
    return (
      (await cartItem.getByTestId('inventory-item-price').textContent()) || ''
    );
  }

  /**
   * Returns the quantity of the given cart item as a string.
   * @param productName Name of the product
   * @returns Quantity as string
   */
  async getCartItemQuantity(productName: string): Promise<string> {
    const cartItem = await this.findCartItemByName(productName);
    return (await cartItem.getByTestId('item-quantity').textContent()) || '';
  }

  /**
   * Clicks the "Checkout" button to proceed to the checkout page.
   */
  async proceedToCheckout() {
    await this.page.getByTestId('checkout').click();
  }

  /**
   * Clicks the "Continue Shopping" button to return to the inventory page.
   */
  async continueShopping() {
    await this.page.getByTestId('continue-shopping').click();
  }

  /**
   * Asserts that the cart is empty.
   */
  async verifyCartIsEmpty() {
    await this.verifyCartItemsCount(0);
  }

  /**
   * Returns the names of all items currently in the cart.
   * @returns Array of product names
   */
  async getAllCartItemNames(): Promise<string[]> {
    const cartItems = await this.getCartItems();
    const names: string[] = [];
    for (const item of cartItems) {
      const name = await item.getByTestId('inventory-item-name').textContent();
      if (name) {
        names.push(name);
      }
    }
    return names;
  }
}
