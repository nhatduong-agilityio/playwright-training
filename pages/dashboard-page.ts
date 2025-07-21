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
  readonly refreshButton: Locator;
  readonly closeButton: Locator;
  readonly modalConfirmYesButton: Locator;
  readonly deleteSelectedButton: Locator;

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
   * Creates a new user by clicking the 'New record' button.
   */
  async createNewRecord() {
    await this.newRecordButton.click();
  }

  /**
   * Creates a new user with the provided details.
   * @param email - The user's email address.
   * @param password - The user's password.
   * @param username - (Optional) The user's username.
   * @param name - (Optional) The user's name.
   */
  async createUser(user: UserRecord) {
    const {
      email,
      password,
      username,
      name,
      passwordConfirm,
      emailVisibility,
      website,
      avatar,
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
   * Verifies that a user with the specified email is created.
   * @param email - The email of the user to verify.
   */
  async verifyUserIsCreated(email: string) {
    const userLocator = await this.page
      .frameLocator('iframe')
      .getByRole('row', { name: email });
    await expect(userLocator).toBeVisible();
    await expect(userLocator).toContainText(email);
  }

  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Refreshes the user table.
   * @throws {Error} If the refresh button is not visible.
   */
  /*******  6c88b70b-f46a-4f30-808a-d3fe27d48f35  *******/
  async refreshTable() {
    await this.refreshButton.click();
  }

  /**
   * Verifies that the email field has a validation error and the
   * validation message is "Please fill out this field.".
   */
  async verifyEmailFieldValidationError() {
    const validationMessage = await this.emailInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage
    );

    await expect(validationMessage).toBe('Please fill out this field.');
  }

  /**
   * Verifies that the email field has a validation error and the
   * validation message is "Must be a valid email address.".
   */
  async verifyEmailFieldIsInvalid() {
    await expect(
      this.container.getByText('Must be a valid email address.')
    ).toBeVisible();
  }

  /**
   * Verifies that the password confirmation field has a validation error
   * and the validation message is "Values don't match.".
   */
  async verifyPasswordConfirmationError() {
    await expect(this.container.getByText(`Values don't match.`)).toBeVisible();
  }

  /**
   * Closes the form container and confirms any modal that appears.
   * If the modal is visible, it will be confirmed, otherwise the method
   * will do nothing.
   */
  async closeFormContainer() {
    await this.closeButton.click();

    const confirmModal = this.modalConfirmYesButton;

    if (await confirmModal.isVisible()) {
      await this.modalConfirmYesButton.click();
    }
  }

  /**
   * Deletes a user record by clicking the checkbox next to the user and
   * clicking the "Delete selected" button. The method will confirm any
   * modal that appears.
   * @param userId - The ID of the user to delete.
   */
  async deleteUserRecord(userId: string) {
    const userLocator = await this.page
      .frameLocator('iframe')
      .getByRole('row', { name: userId });

    await userLocator
      .locator(`.form-field label[for="checkbox_${userId}"]`)
      .click();

    await this.deleteSelectedButton.click();
    await this.modalConfirmYesButton.click();
  }

  /**
   * Verifies that a user with the specified ID is not visible in the
   * table. The method will fail if the user is still visible.
   * @param userId - The ID of the user to verify.
   */
  async verifyUserIsDeleted(userId: string) {
    const userLocator = await this.page
      .frameLocator('iframe')
      .getByRole('row', { name: userId });
    await expect(userLocator).not.toBeVisible();
  }

  /**
   * Verifies that the given message is displayed in the toast message.
   * @param message - The message to verify in the toast message.
   */
  async verifyToastMessageVisible(message: string) {
    await expect(
      this.page.frameLocator('iframe').getByText(message)
    ).toBeVisible();
  }
}
