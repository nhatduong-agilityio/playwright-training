import { expect, Locator, Page } from '@playwright/test';
import { BASE_URL } from '@/constants';
import { UserRecord } from '@/types';

export class DashboardPage {
  readonly page: Page;
  readonly container: Locator;
  readonly newRecordButton: Locator;
  readonly id: Locator;
  readonly emailInput: Locator;
  readonly emailToggleButton: Locator;
  readonly passwordInput: Locator;
  readonly passwordConfirmInput: Locator;
  readonly verifySwitchButton: Locator;
  readonly usernameInput: Locator;
  readonly nameInput: Locator;
  readonly createButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page
      .frameLocator('iframe')
      .locator('.overlay-panel-container');
    this.newRecordButton = this.page
      .frameLocator('iframe')
      .getByRole('button', {
        name: ' New record',
      })
      .first();
    this.id = this.container.getByLabel('id');
    this.emailInput = this.container.getByRole('textbox', {
      name: ' email *',
    });
    this.emailToggleButton = this.container.getByRole('button', {
      name: 'Public: Off',
    });
    this.passwordInput = this.container.getByRole('textbox', {
      name: 'Password *',
    });
    this.passwordConfirmInput = this.container.getByRole('textbox', {
      name: 'Password confirm *',
    });
    this.verifySwitchButton = this.container.getByText('Verified');
    this.usernameInput = this.container.getByRole('textbox', {
      name: ' username',
    });
    this.nameInput = this.container.getByRole('textbox', { name: ' name' });
    this.createButton = this.container.getByRole('button', { name: 'Create' });
    this.cancelButton = this.container.getByRole('button', { name: 'Cancel' });
  }

  /**
   * Navigates to the users page using the base URL from environment or default.
   */
  async goto() {
    await this.page.goto(BASE_URL);
  }

  /**
   * Verifies that the user is logged in and the 'Logged superuser menu'
   * button is visible.
   * @throws {Error} if the button is not visible.
   */
  async verifyAmOnDashboardPage() {
    await expect(
      this.page
        .frameLocator('iframe')
        .getByRole('button', { name: 'Logged superuser menu' })
    ).toBeVisible();
  }

  /**
   * Creates a new user with the provided details.
   * @param email - The user's email address.
   * @param password - The user's password.
   * @param username - (Optional) The user's username.
   * @param name - (Optional) The user's name.
   */
  async createUser(user: UserRecord) {
    const { email, password, username, name, website, avatar } = user;

    await this.newRecordButton.click();
    await this.emailInput.fill(email);
    await this.emailToggleButton.click();
    if (password) {
      await this.passwordInput.fill(password);
      await this.passwordConfirmInput.fill(password);
      await this.verifySwitchButton.click();
    }
    if (username) await this.usernameInput.fill(username);
    if (name) await this.nameInput.fill(name);
    await this.createButton.click();
  }
}
