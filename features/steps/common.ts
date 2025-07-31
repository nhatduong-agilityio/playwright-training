import {
  EMAIL_INVALID_ERROR,
  EMAIL_REQUIRED_ERROR,
  PASSWORD_MISMATCH_ERROR,
} from '@/constants';
import { deleteUser } from '@/actions';
import { expect } from '@playwright/test';
import { After, Given, Then, When } from '@/fixtures';

// Global cleanup - runs after each test
After(async ({ apiContext, ctx }) => {
  if (ctx.userId) {
    await deleteUser(apiContext, ctx.userId);
    ctx.userId = undefined;
  }
});

// ============ COMMON BACKGROUND STEPS ============

Given('I am on the dashboard', async ({ dashboardPage }) => {
  await dashboardPage.goto();
  await dashboardPage.expectOnDashboard();
});

Given('the table is ready', async ({ tablePage }) => {
  await tablePage.waitForTableReady();
});

Given('I have seeded users in the system', async ({ seededUsers, ctx }) => {
  ctx.seededUsers = seededUsers;
});

// ============ COMMON NAVIGATION STEPS ============

When('I refresh the table', async ({ dashboardPage, tablePage }) => {
  await dashboardPage.refreshButton.click();
  await tablePage.waitForTableReady();
});

When('I click the new record button', async ({ dashboardPage }) => {
  await dashboardPage.newRecordButton.click();
});

// ============ COMMON VALIDATION STEPS ============

Then(
  'I should see a validation error {string}',
  async ({ dashboardPage }, expectedError: string) => {
    if (expectedError === EMAIL_REQUIRED_ERROR) {
      await dashboardPage.expectFieldError(
        EMAIL_REQUIRED_ERROR,
        dashboardPage.emailInput,
      );
    } else if (expectedError === EMAIL_INVALID_ERROR) {
      await dashboardPage.expectFieldError(
        EMAIL_INVALID_ERROR,
        dashboardPage.container,
      );
    } else if (expectedError === PASSWORD_MISMATCH_ERROR) {
      await dashboardPage.expectFieldError(
        PASSWORD_MISMATCH_ERROR,
        dashboardPage.container,
      );
    }
  },
);

Then('I should close the user form', async ({ dashboardPage }) => {
  await dashboardPage.closeUserForm();
});

Then(
  'I should see a success message {string}',
  async ({ dashboardPage }, expectedMessage: string) => {
    await dashboardPage.expectToast(expectedMessage);
  },
);

// ============ COMMON ASSERTION STEPS ============

Then(
  'the request should return status {int}',
  async ({ ctx }, expectedStatus: number) => {
    expect(ctx.response?.status()).toBe(expectedStatus);
  },
);

Then(
  'the sort request should return status {int}',
  async ({ ctx }, expectedStatus: number) => {
    expect(ctx.response?.status()).toBe(expectedStatus);
  },
);

Then(
  'the search should return results with status {int}',
  async ({ ctx }, expectedStatus: number) => {
    expect(ctx.response?.status()).toBe(expectedStatus);
  },
);

Then(
  'the user details request should return status {int}',
  async ({ ctx }, expectedStatus: number) => {
    expect(ctx.response?.status()).toBe(expectedStatus);
  },
);
