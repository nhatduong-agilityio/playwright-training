import { MESSAGE_ERRORS } from '@/constants';
import { expect } from '@playwright/test';
import { After, Given, Then, When } from '@/fixtures';
import { userService } from '@/services';

// Global cleanup - runs after each test
After(async ({ apiContext, ctx }) => {
  if (ctx.userId) {
    await userService.delete(apiContext, ctx.userId);
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
  await dashboardPage.clickRefreshButton();
  await tablePage.waitForTableReady();
});

When('I click the new record button', async ({ dashboardPage }) => {
  await dashboardPage.clickNewRecordButton();
});

// ============ COMMON VALIDATION STEPS ============

Then(
  'I should see a validation error {string}',
  async ({ dashboardPage }, expectedError: string) => {
    if (expectedError === MESSAGE_ERRORS.EMAIL_REQUIRED) {
      await dashboardPage.expectFieldError(
        MESSAGE_ERRORS.EMAIL_REQUIRED,
        dashboardPage.emailInput,
      );
    } else if (expectedError === MESSAGE_ERRORS.EMAIL_INVALID) {
      await dashboardPage.expectFieldError(
        MESSAGE_ERRORS.EMAIL_INVALID,
        dashboardPage.container,
      );
    } else if (expectedError === MESSAGE_ERRORS.PASSWORD_MISMATCH) {
      await dashboardPage.expectFieldError(
        MESSAGE_ERRORS.PASSWORD_MISMATCH,
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
