import { expect, Page } from '@playwright/test';

export class CheckoutPage {
  constructor(readonly page: Page) {}

  async verifyStepOneLoaded() {
    await expect(this.page).toHaveURL(/.*checkout-step-one\.html/);
    await expect(
      this.page.getByText('Checkout: Your Information')
    ).toBeVisible();
  }

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

  async continue() {
    await this.page.getByRole('button', { name: /continue/i }).click();
  }

  async verifyCheckoutOverviewPageLoaded() {
    await expect(this.page).toHaveURL(/.*checkout-step-two\.html/);
    await expect(this.page.getByText('Checkout: Overview')).toBeVisible();
  }

  async finish() {
    await this.page.getByRole('button', { name: /finish/i }).click();
  }

  async verifyCompleteLoaded() {
    await expect(this.page).toHaveURL(/.*checkout-complete\.html/);
    await expect(
      this.page.getByText('Thank you for your order!')
    ).toBeVisible();
  }

  async verifyErrorMessage(expected: string) {
    await expect(this.page.getByTestId('error')).toContainText(expected);
  }

  async verifyCartItemsCount(expectedCount: number) {
    await expect(this.page.locator('.cart_item')).toHaveCount(expectedCount);
  }

  async verifyPaymentAndShippingInfo() {
    await expect(this.page.getByText('Payment Information:')).toBeVisible();
    await expect(this.page.getByText('Shipping Information:')).toBeVisible();
    await expect(this.page.getByText('Price Total')).toBeVisible();
  }
}
