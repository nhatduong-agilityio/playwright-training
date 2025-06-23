import { expect, Page, Locator } from '@playwright/test';

export class InventoryPage {
  constructor(readonly page: Page) {}

  async verifyPageLoaded() {
    await expect(this.page).toHaveURL(/.*inventory\.html/);
    await expect(this.page.getByText('Products')).toBeVisible();
  }

  async getProductItems() {
    return await this.page.getByTestId('inventory-item').all();
  }

  async findProductByName(productName: string): Promise<Locator> {
    const productItems = await this.getProductItems();

    for (const item of productItems) {
      const nameElement = item.getByTestId('inventory-item-name');
      const actualName = await nameElement.textContent();

      if (
        actualName &&
        actualName.toLowerCase().includes(productName.toLowerCase())
      ) {
        return item;
      }
    }

    throw new Error(`Product with name "${productName}" not found`);
  }

  async verifyProductExists(productName: string) {
    const productItem = await this.findProductByName(productName);
    await expect(productItem.getByTestId('inventory-item-name')).toContainText(
      productName
    );
  }

  async verifyMultipleProductsExist(productNames: string[]) {
    for (const productName of productNames) {
      await this.verifyProductExists(productName);
    }
  }

  async addProductToCartByName(productName: string): Promise<Locator> {
    const productItem = await this.findProductByName(productName);

    // Verify product name before adding
    await expect(productItem.getByTestId('inventory-item-name')).toContainText(
      productName
    );

    // Click add to cart button
    await productItem.locator('button', { hasText: /add to cart/i }).click();

    return productItem;
  }

  async addMultipleProductsToCart(productNames: string[]): Promise<Locator[]> {
    const addedItems: Locator[] = [];

    for (const productName of productNames) {
      const item = await this.addProductToCartByName(productName);
      addedItems.push(item);
    }

    return addedItems;
  }

  async verifyRemoveButtonForProduct(productName: string) {
    const productItem = await this.findProductByName(productName);
    await expect(
      productItem.locator('button', { hasText: /remove/i })
    ).toBeVisible();
  }

  async verifyRemoveButtonsForProducts(productNames: string[]) {
    for (const productName of productNames) {
      await this.verifyRemoveButtonForProduct(productName);
    }
  }

  async verifyAddToCartButtonForProduct(productName: string) {
    const productItem = await this.findProductByName(productName);
    await expect(
      productItem.locator('button', { hasText: /add to cart/i })
    ).toBeVisible();
  }

  async removeProductFromCartByName(productName: string) {
    const productItem = await this.findProductByName(productName);
    await productItem.locator('button', { hasText: /remove/i }).click();
  }

  async removeMultipleProductsFromCart(productNames: string[]) {
    for (const productName of productNames) {
      await this.removeProductFromCartByName(productName);
    }
  }

  async verifyCartBadge(expectedCount: string) {
    await expect(this.page.locator('.shopping_cart_badge')).toHaveText(
      expectedCount
    );
  }

  async verifyCartBadgeNotVisible() {
    await expect(this.page.locator('.shopping_cart_badge')).toHaveCount(0);
  }

  async openSidebar() {
    await this.page.getByRole('button', { name: /open menu/i }).click();
  }

  async closeSidebar() {
    await this.page.getByRole('button', { name: /close menu/i }).click();
  }

  async navigateToCart() {
    await this.page.getByTestId('shopping-cart-link').click();
  }

  async getProductPrice(productName: string): Promise<string> {
    const productItem = await this.findProductByName(productName);
    return (
      (await productItem.getByTestId('inventory-item-price').textContent()) ||
      ''
    );
  }

  async getProductDescription(productName: string): Promise<string> {
    const productItem = await this.findProductByName(productName);
    return (
      (await productItem.getByTestId('inventory-item-desc').textContent()) || ''
    );
  }

  // Helper to add products to cart from inventory page
  async addProductsToCart(products: string[]) {
    await this.verifyPageLoaded();
    await this.addMultipleProductsToCart(products);
    await this.verifyCartBadge(products.length.toString());
    await this.verifyRemoveButtonsForProducts(products);
  }

  async getProductNamesInOrder(): Promise<string[]> {
    return await this.page.getByTestId('inventory-item-name').allTextContents();
  }

  async logout() {
    await this.page.getByRole('button', { name: /open menu/i }).click();
    await this.page.getByRole('link', { name: /logout/i }).click();
    await expect(this.page).toHaveURL('https://www.saucedemo.com/');
  }
}
