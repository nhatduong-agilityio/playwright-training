import { When, Then } from '@/fixtures';
import { expect } from '@playwright/test';
import { VALID_USER, INVALID_USERS } from '@/constants';
import { waitResponseFromMethodPost } from '@/utils';
import { USERS_PATH } from '@/constants/';

When(
  'I create a user with the following data:',
  async ({ dashboardPage, page, ctx }, dataTable) => {
    const userData = dataTable.rowsHash();
    ctx.email = VALID_USER.email;

    const [response] = await Promise.all([
      waitResponseFromMethodPost({
        url: USERS_PATH,
        page,
      }),
      dashboardPage.submitUserForm({
        email: VALID_USER.email,
        password: VALID_USER.password,
        username: VALID_USER.username,
        name: VALID_USER.name,
        emailVisibility: userData.emailVisibility === 'true',
      }),
    ]);

    const responseBody = await response.json();
    ctx.userId = responseBody.id;
    ctx.response = response;
  },
);

When(
  'I attempt to create a user with empty email and password',
  async ({ dashboardPage }) => {
    await dashboardPage.submitUserForm({
      email: INVALID_USERS.empty.email,
      password: INVALID_USERS.empty.password,
      emailVisibility: false,
    });
  },
);

When(
  'I attempt to create a user with invalid email {string}',
  async ({ dashboardPage }, invalidEmail: string) => {
    await dashboardPage.submitUserForm({
      email: invalidEmail,
      password: INVALID_USERS.badEmail.password,
      emailVisibility: false,
    });
  },
);

When(
  'I attempt to create a user with mismatched passwords',
  async ({ dashboardPage }) => {
    await dashboardPage.submitUserForm({
      email: INVALID_USERS.mismatchedPassword.email(),
      password: INVALID_USERS.mismatchedPassword.password,
      passwordConfirm: INVALID_USERS.mismatchedPassword.passwordConfirm,
      emailVisibility: false,
    });
  },
);

Then(
  'the user should be created successfully with status {int}',
  async ({ ctx }, expectedStatus: number) => {
    expect(ctx.response?.status()).toBe(expectedStatus);
  },
);

Then(
  'the user should appear in the table',
  async ({ dashboardPage, tablePage, ctx }) => {
    await dashboardPage.refreshButton.click();
    await tablePage.waitForTableReady();
    await tablePage.expectRowVisible('email', ctx.email!);
  },
);

Then(
  'the user data should match what was entered',
  async ({ tablePage, ctx }) => {
    await tablePage.expectRowData('email', ctx.email!, {
      email: ctx.email,
      username: VALID_USER.username,
      name: VALID_USER.name,
      emailVisibility: true,
    });
  },
);
