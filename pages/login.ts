import { BASE_URL } from '@/constants';
import { expect, Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly loginHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.frameLocator('iframe').getByLabel('Email');
    this.passwordInput = page.frameLocator('iframe').getByLabel('Password');
    this.loginButton = page
      .frameLocator('iframe')
      .getByRole('button', { name: 'Login' });
    this.loginHeading = page.frameLocator('iframe').getByRole('heading', {
      name: 'Superuser login',
      level: 4,
    });
  }

  /**
   * Navigates to the login page using the base URL from environment or default.
   */
  async goto() {
    await this.page.goto(BASE_URL);
  }

  /**
   * Logs in using the provided email and password.
   * @param email - The user's email address.
   * @param password - The user's password.
   */
  async loginAs(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  /**
   * Verifies that the page is on the login page.
   * @throws {Error} if the page is not on the login page.
   */
  async verifyAmOnLoginPage() {
    await expect(this.loginHeading).toBeVisible();
  }

  /**
   * Verifies that the given message is displayed in the toast message.
   * @param message - The message to verify in the toast message.
   */
  async verifyToastMessageVisible(message: string) {
    await expect(
      this.page.frameLocator('iframe').getByText(message),
    ).toBeVisible();
  }

  /**
   * Verifies that the "Please fill out this field." validation message is visible when
   * attempting to log in with empty fields.
   */
  async verifyEmptyFieldValidationError() {
    const validationMessage = await this.emailInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage,
    );

    await expect(validationMessage).toBe('Please fill out this field.');
  }

  /**
   * Verifies that the user is logged in and the 'Logged superuser menu'
   * button is visible.
   * @throws {Error} if the button is not visible.
   */
  async verifyLoginSuccess() {
    await expect(
      this.page
        .frameLocator('iframe')
        .getByRole('button', { name: 'Logged superuser menu' }),
    ).toBeVisible();
  }
}
