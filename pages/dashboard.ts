import { expect, Locator, Page } from '@playwright/test';
import { BASE_URL, MESSAGE_ERRORS } from '@/constants';
import { User } from '@/types';

export class DashboardPage {
  readonly page: Page;
  readonly container: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page
      .frameLocator('iframe')
      .locator('.overlay-panel-container');
  }

  get id() {
    return this.container.getByLabel('id');
  }

  get emailInput() {
    return this.container.getByRole('textbox', {
      name: ' email *',
    });
  }

  get emailToggleButton() {
    return this.container.getByRole('button', {
      name: 'Public: Off',
    });
  }

  get passwordInput() {
    return this.container.getByRole('textbox', {
      name: 'Password *',
    });
  }

  get passwordConfirmInput() {
    return this.container.getByRole('textbox', {
      name: 'Password confirm *',
    });
  }

  get usernameInput() {
    return this.container.getByRole('textbox', {
      name: ' username',
    });
  }

  get verifySwitchButton() {
    return this.container.getByText('Verified');
  }

  get nameInput() {
    return this.container.getByRole('textbox', { name: ' name' });
  }

  get modalConfirmYesButton() {
    return this.container.getByRole('button', {
      name: 'Yes',
    });
  }

  get searchInput() {
    return this.page
      .frameLocator('iframe')
      .locator('form.searchbar')
      .getByRole('textbox');
  }

  async clickRefreshButton() {
    return await this.page
      .frameLocator('iframe')
      .getByRole('button', {
        name: 'Refresh',
      })
      .click();
  }

  async clickSaveChangesButton() {
    return await this.container
      .getByRole('button', {
        name: 'Save changes',
      })
      .click();
  }

  async clickCloseButton() {
    return this.container
      .getByRole('button', {
        name: 'Close',
      })
      .click();
  }

  async clickNewRecordButton() {
    return await this.page
      .frameLocator('iframe')
      .locator('header')
      .getByRole('button', {
        name: ' New record',
      })
      .click();
  }

  async clickCreateButton() {
    return await this.container.getByRole('button', { name: 'Create' }).click();
  }

  /**
   * Navigates to the dashboard page using the base URL.
   */
  async goto() {
    await this.page.goto(BASE_URL);
  }

  async clearSearchButton() {
    await this.page
      .frameLocator('iframe')
      .locator('form.searchbar')
      .getByRole('button', { name: 'Clear' })
      .click();
  }

  /**
   * Asserts that the user sidebar is visible.
   */
  async expectUserSidebar() {
    const userSidebar = this.page
      .frameLocator('iframe')
      .getByRole('link', { name: 'users' });

    await expect(userSidebar).toBeVisible();
    await userSidebar.click();
  }

  /**
   * Asserts that the dashboard page is loaded by checking for the superuser menu button.
   */
  async expectOnDashboard() {
    await expect(
      this.page
        .frameLocator('iframe')
        .getByRole('button', { name: 'Logged superuser menu' }),
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
    await this.clickCreateButton();
  }

  /**
   * Asserts that a field shows the given error message.
   * @param message - The expected error message.
   * @param locator - The locator for the field or container.
   */
  async expectFieldError(message: string, locator: Locator) {
    if (message === MESSAGE_ERRORS.EMAIL_REQUIRED) {
      const validationMessage = await locator.evaluate(
        (el: HTMLInputElement) => el.validationMessage,
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
    await this.clickCloseButton();
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
      this.page.frameLocator('iframe').getByText(message),
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
    await this.clickSaveChangesButton();
  }

  /**
   * Searches for users by the given keyword.
   * @param keyword - The keyword to search for.
   */
  async searchRecords(keyword: string) {
    await this.searchInput.fill(keyword);
    await this.page
      .frameLocator('iframe')
      .locator('form.searchbar')
      .getByRole('button', { name: 'Search' })
      .click();
  }
}
