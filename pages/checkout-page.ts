import { expect, Page } from '@playwright/test';

/**
 * Page Object Model for the Checkout page.
 */
export class CheckoutPage {
  /**
   * Initializes the CheckoutPage with a Playwright Page object.
   * @param page Playwright Page instance
   */
  constructor(readonly page: Page) {}

  /**
   * Asserts that the first step of the checkout process is loaded.
   */
  async verifyStepOneLoaded() {
    await expect(this.page).toHaveURL(/.*checkout-step-one\.html/);
    await expect(
      this.page.getByText('Checkout: Your Information')
    ).toBeVisible();
  }

  /**
   * Fills in the checkout information form with the provided values.
   * @param param0 Object containing firstName, lastName, and postalCode
   */
  async fillInfo({
    firstName,
    lastName,
    postalCode,
  }: {
    firstName?: string;
    lastName?: string;
    postalCode?: string;
  }) {
    if (firstName !== undefined) {
      await this.page.getByPlaceholder('First Name').fill(firstName);
    }
    if (lastName !== undefined) {
      await this.page.getByPlaceholder('Last Name').fill(lastName);
    }
    if (postalCode !== undefined) {
      await this.page.getByPlaceholder('Zip/Postal Code').fill(postalCode);
    }
  }

  /**
   * Clicks the "Continue" button to proceed to the next step of checkout.
   */
  async continue() {
    await this.page.getByRole('button', { name: /continue/i }).click();
  }

  /**
   * Asserts that the checkout overview page is loaded.
   */
  async verifyCheckoutOverviewPageLoaded() {
    await expect(this.page).toHaveURL(/.*checkout-step-two\.html/);
    await expect(this.page.getByText('Checkout: Overview')).toBeVisible();
  }

  /**
   * Clicks the "Finish" button to complete the checkout.
   */
  async finish() {
    await this.page.getByRole('button', { name: /finish/i }).click();
  }

  /**
   * Asserts that the checkout complete page is loaded.
   */
  async verifyCompleteLoaded() {
    await expect(this.page).toHaveURL(/.*checkout-complete\.html/);
    await expect(
      this.page.getByText('Thank you for your order!')
    ).toBeVisible();
  }

  /**
   * Asserts that the error message matches the expected text.
   * @param expected Expected error message
   */
  async verifyErrorMessage(expected: string) {
    await expect(this.page.getByTestId('error')).toContainText(expected);
  }

  /**
   * Asserts that the number of items in the cart matches the expected count.
   * @param expectedCount Expected number of items
   */
  async verifyCartItemsCount(expectedCount: number) {
    await expect(this.page.locator('.cart_item')).toHaveCount(expectedCount);
  }

  /**
   * Asserts that payment and shipping information is visible on the overview page.
   */
  async verifyPaymentAndShippingInfo() {
    await expect(this.page.getByText('Payment Information:')).toBeVisible();
    await expect(this.page.getByText('Shipping Information:')).toBeVisible();
    await expect(this.page.getByText('Price Total')).toBeVisible();
  }
}
