import { expect, Page, Locator } from '@playwright/test';
import { INVENTORY_URL } from '@/constants';

/**
 * Page Object Model for the Inventory page.
 */
export class InventoryPage {
  /**
   * Initializes the InventoryPage with a Playwright Page object.
   * @param page Playwright Page instance
   */
  constructor(readonly page: Page) {}

  /**
   * Asserts that the inventory page is loaded by checking the URL and the presence of the "Products" text.
   */
  async verifyPageLoaded() {
    await expect(this.page).toHaveURL(/.*inventory\.html/);
    await expect(this.page.getByText('Products')).toBeVisible();
  }

  /**
   * Returns all product item locators on the inventory page.
   */
  async getProductItems() {
    return await this.page.getByTestId('inventory-item').all();
  }

  /**
   * Finds and returns the locator for a product by its name. Throws an error if not found.
   * @param productName Name of the product to find
   * @returns Locator for the product
   */
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

  /**
   * Asserts that a product with the given name exists on the page.
   * @param productName Name of the product
   */
  async verifyProductExists(productName: string) {
    const productItem = await this.findProductByName(productName);
    await expect(productItem.getByTestId('inventory-item-name')).toContainText(
      productName
    );
  }

  /**
   * Asserts that all products in the given list exist on the page.
   * @param productNames Array of product names
   */
  async verifyMultipleProductsExist(productNames: string[]) {
    for (const productName of productNames) {
      await this.verifyProductExists(productName);
    }
  }

  /**
   * Adds a product to the cart by its name and returns its locator.
   * @param productName Name of the product
   * @returns Locator for the product
   */
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

  /**
   * Adds multiple products to the cart by their names and returns their locators.
   * @param productNames Array of product names
   * @returns Array of Locators for the products
   */
  async addMultipleProductsToCart(productNames: string[]): Promise<Locator[]> {
    const addedItems: Locator[] = [];
    for (const productName of productNames) {
      const item = await this.addProductToCartByName(productName);
      addedItems.push(item);
    }
    return addedItems;
  }

  /**
   * Asserts that the "Remove" button is visible for the given product.
   * @param productName Name of the product
   */
  async verifyRemoveButtonForProduct(productName: string) {
    const productItem = await this.findProductByName(productName);
    await expect(
      productItem.locator('button', { hasText: /remove/i })
    ).toBeVisible();
  }

  /**
   * Asserts that the "Remove" button is visible for all given products.
   * @param productNames Array of product names
   */
  async verifyRemoveButtonsForProducts(productNames: string[]) {
    for (const productName of productNames) {
      await this.verifyRemoveButtonForProduct(productName);
    }
  }

  /**
   * Asserts that the "Add to Cart" button is visible for the given product.
   * @param productName Name of the product
   */
  async verifyAddToCartButtonForProduct(productName: string) {
    const productItem = await this.findProductByName(productName);
    await expect(
      productItem.locator('button', { hasText: /add to cart/i })
    ).toBeVisible();
  }

  /**
   * Removes a product from the cart by its name.
   * @param productName Name of the product
   */
  async removeProductFromCartByName(productName: string) {
    const productItem = await this.findProductByName(productName);
    await productItem.locator('button', { hasText: /remove/i }).click();
  }

  /**
   * Removes multiple products from the cart by their names.
   * @param productNames Array of product names
   */
  async removeMultipleProductsFromCart(productNames: string[]) {
    for (const productName of productNames) {
      await this.removeProductFromCartByName(productName);
    }
  }

  /**
   * Asserts that the cart badge shows the expected count.
   * @param expectedCount Expected cart badge count as string
   */
  async verifyCartBadge(expectedCount: string) {
    await expect(this.page.locator('.shopping_cart_badge')).toHaveText(
      expectedCount
    );
  }

  /**
   * Asserts that the cart badge is not visible (cart is empty).
   */
  async verifyCartBadgeNotVisible() {
    await expect(this.page.locator('.shopping_cart_badge')).toHaveCount(0);
  }

  /**
   * Opens the sidebar menu.
   */
  async openSidebar() {
    await this.page.getByRole('button', { name: /open menu/i }).click();
  }

  /**
   * Closes the sidebar menu.
   */
  async closeSidebar() {
    await this.page.getByRole('button', { name: /close menu/i }).click();
  }

  /**
   * Navigates to the cart page.
   */
  async navigateToCart() {
    await this.page.getByTestId('shopping-cart-link').click();
  }

  /**
   * Returns the price of the given product as a string.
   * @param productName Name of the product
   * @returns Price as string
   */
  async getProductPrice(productName: string): Promise<string> {
    const productItem = await this.findProductByName(productName);
    return (
      (await productItem.getByTestId('inventory-item-price').textContent()) ||
      ''
    );
  }

  /**
   * Returns the description of the given product as a string.
   * @param productName Name of the product
   * @returns Description as string
   */
  async getProductDescription(productName: string): Promise<string> {
    const productItem = await this.findProductByName(productName);
    return (
      (await productItem.getByTestId('inventory-item-desc').textContent()) || ''
    );
  }

  /**
   * Helper to add products to the cart from the inventory page, verifying the page and cart state.
   * @param products Array of product names
   */
  async addProductsToCart(products: string[]) {
    await this.verifyPageLoaded();
    await this.addMultipleProductsToCart(products);
    await this.verifyCartBadge(products.length.toString());
    await this.verifyRemoveButtonsForProducts(products);
  }

  /**
   * Returns the names of all products in the order they appear on the page.
   * @returns Array of product names
   */
  async getProductNamesInOrder(): Promise<string[]> {
    return await this.page.getByTestId('inventory-item-name').allTextContents();
  }

  /**
   * Logs out the current user by opening the sidebar and clicking the "Logout" link.
   */
  async logout() {
    await this.page.getByRole('button', { name: /open menu/i }).click();
    await this.page.getByRole('link', { name: /logout/i }).click();
    await expect(this.page).toHaveURL('https://www.saucedemo.com/');
  }

  /**
   * Resets the app state by opening the sidebar, clicking "Reset App State," and closing the sidebar.
   */
  async resetAppState() {
    await this.openSidebar();
    await this.page.getByRole('link', { name: /reset app state/i }).click();
    await this.closeSidebar();
  }

  /**
   * Selects a sort option from the inventory page.
   * @param option The sort option to select
   */
  async selectSortOption(option: string) {
    await this.page.getByRole('combobox').selectOption(option);
  }

  /**
   * Navigates to the inventory page using INVENTORY_URL.
   */
  async goto() {
    await this.page.goto(INVENTORY_URL);
  }
}
