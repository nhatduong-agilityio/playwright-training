import { expect, Page, Locator } from '@playwright/test';

export class CartPage {
  constructor(readonly page: Page) {}

  async verifyPageLoaded() {
    await expect(this.page.getByText('Your Cart')).toBeVisible();
    await expect(this.page).toHaveURL(/.*cart\.html/);
  }

  async getCartItems() {
    return await this.page.locator('.cart_item').all();
  }

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

  async verifyCartItemsCount(expectedCount: number) {
    const cartItems = await this.getCartItems();
    await expect(cartItems).toHaveLength(expectedCount);
  }

  async verifyCartItemExists(productName: string) {
    const cartItem = await this.findCartItemByName(productName);
    await expect(cartItem.getByTestId('inventory-item-name')).toContainText(
      productName
    );
  }

  async verifyMultipleCartItemsExist(productNames: string[]) {
    await this.verifyCartItemsCount(productNames.length);

    for (const productName of productNames) {
      await this.verifyCartItemExists(productName);
    }
  }

  async removeCartItemByName(productName: string) {
    const cartItem = await this.findCartItemByName(productName);
    await cartItem.locator('button', { hasText: /remove/i }).click();
  }

  async removeMultipleCartItems(productNames: string[]) {
    for (const productName of productNames) {
      await this.removeCartItemByName(productName);
    }
  }

  async verifyRemoveButtonForProduct(productName: string) {
    const cartItem = await this.findCartItemByName(productName);
    await expect(
      cartItem.locator('button', { hasText: /remove/i })
    ).toBeVisible();
  }

  async getCartItemPrice(productName: string): Promise<string> {
    const cartItem = await this.findCartItemByName(productName);
    return (
      (await cartItem.getByTestId('inventory-item-price').textContent()) || ''
    );
  }

  async getCartItemQuantity(productName: string): Promise<string> {
    const cartItem = await this.findCartItemByName(productName);
    return (await cartItem.getByTestId('item-quantity').textContent()) || '';
  }

  async proceedToCheckout() {
    await this.page.getByTestId('checkout').click();
  }

  async continueShopping() {
    await this.page.getByTestId('continue-shopping').click();
  }

  async verifyCartIsEmpty() {
    await this.verifyCartItemsCount(0);
  }

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
