import { Page } from '@playwright/test';
import { BASE_URL, USERS } from '../constants';

/**
 * Page Object Model for the Login page.
 */
export class LoginPage {
  /**
   * Initializes the LoginPage with a Playwright Page object.
   * @param page Playwright Page instance
   */
  constructor(readonly page: Page) {}

  /**
   * Navigates to the login page (base URL).
   */
  async goto() {
    await this.page.goto(BASE_URL);
  }

  /**
   * Navigates to the login page and logs in with the provided user credentials (defaults to standard user).
   * @param user User credentials object (default: USERS.STANDARD)
   */
  async login(user = USERS.STANDARD) {
    await this.goto();
    await this.page.getByPlaceholder('Username').fill(user.username);
    await this.page.getByPlaceholder('Password').fill(user.password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }
}
