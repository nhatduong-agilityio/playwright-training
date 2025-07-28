import { expect, Locator, Page } from '@playwright/test';
import { BASE_URL, EMAIL_REQUIRED_ERROR } from '@/constants';
import { User } from '@/types';

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
  readonly refreshButton: Locator;
  readonly closeButton: Locator;
  readonly modalConfirmYesButton: Locator;
  readonly deleteSelectedButton: Locator;
  readonly saveChangesButton: Locator;
  readonly searchInput: Locator;
  readonly submitSearchButton: Locator;
  readonly clearSearchButton: Locator;
  readonly userSidebar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page
      .frameLocator('iframe')
      .locator('.overlay-panel-container');
    this.newRecordButton = this.page
      .frameLocator('iframe')
      .locator('header')
      .getByRole('button', {
        name: ' New record',
      });
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
    this.refreshButton = this.page.frameLocator('iframe').getByRole('button', {
      name: 'Refresh',
    });
    this.closeButton = this.container.getByRole('button', {
      name: 'Close',
    });
    this.modalConfirmYesButton = this.container.getByRole('button', {
      name: 'Yes',
    });
    this.deleteSelectedButton = this.page
      .frameLocator('iframe')
      .getByRole('button', { name: 'Delete selected' });
    this.saveChangesButton = this.container.getByRole('button', {
      name: 'Save changes',
    });
    this.searchInput = this.page
      .frameLocator('iframe')
      .locator('form.searchbar')
      .getByRole('textbox');
    this.submitSearchButton = this.page
      .frameLocator('iframe')
      .locator('form.searchbar')
      .getByRole('button', { name: 'Search' });
    this.clearSearchButton = this.page
      .frameLocator('iframe')
      .locator('form.searchbar')
      .getByRole('button', { name: 'Clear' });
    this.userSidebar = this.page
      .frameLocator('iframe')
      .getByRole('link', { name: 'users' });
  }

  /**
   * Navigates to the dashboard page using the base URL.
   */
  async goto() {
    await this.page.goto(BASE_URL);
  }

  /**
   * Asserts that the user sidebar is visible.
   */
  async expectUserSidebar() {
    await expect(this.userSidebar).toBeVisible();
    await this.userSidebar.click();
  }

  /**
   * Asserts that the dashboard page is loaded by checking for the superuser menu button.
   */
  async expectOnDashboard() {
    await expect(
      this.page
        .frameLocator('iframe')
        .getByRole('button', { name: 'Logged superuser menu' })
    ).toBeVisible();
    await this.expectUserSidebar();
  }

  /**
   * Fills and submits the user creation form with the provided user data.
   * @param user - The user data to submit.
   */
  async submitUserForm(user: User) {
    const {
      email,
      password,
      username,
      name,
      passwordConfirm,
      emailVisibility,
    } = user;
    await this.emailInput.fill(email);
    if (emailVisibility) await this.emailToggleButton.click();
    if (password) {
      await this.passwordInput.fill(password);
      await this.passwordConfirmInput.fill(passwordConfirm || password);
      await this.verifySwitchButton.click();
    }
    if (username) await this.usernameInput.fill(username);
    if (name) await this.nameInput.fill(name);
    await this.createButton.click();
  }

  /**
   * Asserts that a field shows the given error message.
   * @param message - The expected error message.
   * @param locator - The locator for the field or container.
   */
  async expectFieldError(message: string, locator: Locator) {
    if (message === EMAIL_REQUIRED_ERROR) {
      const validationMessage = await locator.evaluate(
        (el: HTMLInputElement) => el.validationMessage
      );
      await expect(validationMessage).toBe(message);
    } else {
      await expect(this.container.getByText(message)).toBeVisible();
    }
  }

  /**
   * Closes the user form and confirms any modal if present.
   */
  async closeUserForm() {
    await this.closeButton.click();
    const confirmModal = this.modalConfirmYesButton;
    if (await confirmModal.isVisible()) {
      await this.modalConfirmYesButton.click();
    }
  }

  /**
   * Asserts that a toast message with the given text is visible.
   * @param message - The message to check for.
   */
  async expectToast(message: string) {
    await expect(
      this.page.frameLocator('iframe').getByText(message)
    ).toBeVisible();
  }

  /**
   * Asserts that the user details form contains the expected values.
   * @param user - The user data to check.
   */
  async expectUserDetails(user: User) {
    const { email, username, name } = user;
    if (email) {
      await expect(this.emailInput).toHaveValue(email);
    }
    if (username) {
      await expect(this.usernameInput).toHaveValue(username);
    }
    if (name) {
      await expect(this.nameInput).toHaveValue(name);
    }
  }

  /**
   * Edits the user form with the provided new user data and submits changes.
   * @param newUser - The new user data to fill in.
   */
  async editUser(newUser: {
    email?: string;
    username?: string;
    name?: string;
  }) {
    const { email, username, name } = newUser;
    if (email) {
      await this.emailInput.click();
      await this.emailInput.fill(email);
    }
    if (username) {
      await this.usernameInput.click();
      await this.usernameInput.fill(username);
    }
    if (name) {
      await this.nameInput.click();
      await this.nameInput.fill(name);
    }
    await this.saveChangesButton.click();
  }

  /**
   * Searches for users by the given keyword.
   * @param keyword - The keyword to search for.
   */
  async searchRecords(keyword: string) {
    await this.searchInput.fill(keyword);
    await this.submitSearchButton.click();
  }
}
