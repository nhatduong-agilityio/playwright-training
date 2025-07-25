import { expect, Locator, Page } from '@playwright/test';
import { BASE_URL } from '@/constants';
import { Table, User } from '@/types';
import { EMAIL_REQUIRED_ERROR } from '@/constants';

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
  }

  /**
   * Navigates to the dashboard page using the base URL.
   */
  async goto() {
    await this.page.goto(BASE_URL);
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
   * Sorts the user table by the specified field.
   * @param field - The column field to sort by.
   */
  async sortBy(field: string) {
    const userRow = await this.page
      .frameLocator('iframe')
      .getByRole('row')
      .filter({ hasText: field })
      .first();
    await userRow.click();
  }

  /**
   * Asserts that the user table is sorted by the given field and order.
   * @param options - The field and order to check.
   */
  async expectSortedBy(options: {
    field: 'id' | 'email' | 'username' | 'name' | 'created' | 'updated';
    order: 'asc' | 'desc';
  }) {
    const { field, order } = options;

    const cells = this.page
      .frameLocator('iframe')
      .getByRole('cell')
      .locator(`.col-field-${field}`);

    let values = await cells.allTextContents();

    // Clean values
    values = values.map(value => value.trim());

    // Create expected sorted array
    const expectedValues = [...values];

    // Sort based on field type
    if (field === 'created' || field === 'updated') {
      // Date sorting
      expectedValues.sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        const comparison = dateA.getTime() - dateB.getTime();
        return order === 'asc' ? comparison : -comparison;
      });
    } else {
      // Text sorting
      expectedValues.sort((a, b) => {
        const comparison = a.localeCompare(b);
        return order === 'asc' ? comparison : -comparison;
      });
    }

    // Verify sorting
    expect(values).toEqual(expectedValues);
  }

  /**
   * Sorts the user table by the given field and asserts the order.
   * @param field - The field to sort by.
   * @param expectedOrder - The expected sort order ('asc' or 'desc').
   */
  async sortAndExpect(
    field: 'id' | 'email' | 'username' | 'name' | 'created' | 'updated',
    expectedOrder: 'asc' | 'desc'
  ) {
    await this.sortBy(field);
    await this.expectSortedBy({ field, order: expectedOrder });
  }

  /**
   * Searches for users by the given keyword.
   * @param keyword - The keyword to search for.
   */
  async searchUsers(keyword: string) {
    await this.searchInput.fill(keyword);
    await this.submitSearchButton.click();
  }

  /**
   * Asserts that the search results contain the given keyword in at least one user.
   * @param users - The list of users returned from the search.
   * @param keyword - The keyword to check for in the results.
   */
  async expectSearchResultsContain(users: User[], keyword: string) {
    const results = users.filter(
      (user: User) =>
        user.email.includes(keyword) ||
        user.username?.includes(keyword) ||
        user.name?.includes(keyword)
    );
    expect(results.length).toBeGreaterThan(0);
    const searchResults = this.page
      .frameLocator('iframe')
      .getByRole('row')
      .filter({ hasText: keyword })
      .first();
    const resultsCount = await searchResults.count();
    await expect(searchResults).toBeVisible();
    await expect(resultsCount).toBeGreaterThan(0);
  }

  /**
   * Finds a row in the user table by a field and value, and returns the row data as an object.
   * @param field - The column field to search by (e.g., 'email').
   * @param value - The value to match in the specified field.
   * @returns An object containing the row data.
   */
  async getRowByValue(columnName: keyof Table, value: string) {
    return await this.page
      .frameLocator('iframe')
      .locator('tr.row-handle')
      .filter({
        has: this.page
          .frameLocator('iframe')
          .locator(`td.col-field-${columnName}`, {
            hasText: value,
          }),
      })
      .first();
  }

  /**
   * Asserts that a user with the given value in the specified column has the
   * expected data in the user table.
   * @param columnName - The column to search by (e.g., 'email').
   * @param value - The value to match in the specified column.
   * @param expectedData - The expected user data.
   */
  async expectRowData(
    columnName: keyof Table,
    value: string,
    expectedData: User
  ) {
    const rowLocator = await this.getRowByValue(columnName, value);

    await expect(rowLocator.locator('td.col-field-email span')).toHaveText(
      expectedData.email
    );
    await expect(rowLocator.locator('td.col-field-username span')).toHaveText(
      expectedData.username || ''
    );
    await expect(rowLocator.locator('td.col-field-name span')).toHaveText(
      expectedData.name || ''
    );
    await expect(
      rowLocator.locator('td.col-field-emailVisibility span.label')
    ).toHaveText(expectedData.emailVisibility ? 'True' : 'False');
    await expect(
      rowLocator.locator('td.col-field-verified span.label')
    ).toHaveText(expectedData.verified ? 'True' : 'False');
  }

  /**
   * Asserts that a user with the given ID is not visible in the user table.
   * @param userId - The ID to check for absence.
   */
  async expectUserNotVisible(columnName: keyof Table, value: string) {
    const rowLocator = await this.getRowByValue(columnName, value);

    await expect(rowLocator).not.toBeVisible();
  }

  /**
   * Deletes a user by their ID from the user table.
   * @param userId - The ID of the user to delete.
   */
  async deleteRowSelected(columnName: keyof Table, value: string) {
    const rowLocator = await this.getRowByValue(columnName, value);

    await rowLocator.locator('td.bulk-select-col .form-field label').click();
    await this.deleteSelectedButton.click();
    await this.modalConfirmYesButton.click();
  }

  /**
   * Opens the details view for a user by their ID.
   * @param userId - The ID of the user to view.
   */
  async openRowDetails(columnName: keyof Table, value: string) {
    const rowLocator = await this.getRowByValue(columnName, value);
    const actionArrow = await rowLocator.locator(
      'td.col-type-action i.ri-arrow-right-line'
    );
    await actionArrow.click();
  }
}
