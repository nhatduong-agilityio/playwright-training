import { createUserAction, deleteUserAction } from '@/actions';
import { INVALID_USERS, USERS_PATH, VALID_USER } from '@/constants';
import { test } from '@/fixtures';
import { waitForResponseFromMethodPatch } from '@/utils';
import { expect } from '@playwright/test';

test.describe('Update User Record', () => {
  let userId: string | undefined;
  let email: string;

  test.beforeEach(async ({ apiContext, dashboardPage }) => {
    await dashboardPage.goto();
    await dashboardPage.verifyAmOnDashboardPage();

    email = VALID_USER.email();
    const userResponse = await createUserAction(apiContext, {
      email,
      password: VALID_USER.password,
      passwordConfirm: VALID_USER.password,
      username: VALID_USER.username(),
      name: VALID_USER.name,
      emailVisibility: true,
    });
    const user = await userResponse.json();
    userId = user.id;

    await dashboardPage.refreshTable();
    await dashboardPage.verifyUserIsCreated(email);
    await dashboardPage.viewUserDetails(userId!);
  });

  test.afterEach(async ({ dashboardPage, apiContext }) => {
    if (userId) {
      await deleteUserAction(apiContext, userId);
      await dashboardPage.refreshTable();
      userId = undefined;
    }
  });

  test('That verify user can update an existing user with valid data', async ({
    dashboardPage,
    page,
  }) => {
    const newUser = {
      username: 'updated_username',
      name: 'Updated Name',
    };

    const [updateResponse] = await Promise.all([
      waitForResponseFromMethodPatch({ page, url: USERS_PATH, id: userId! }),
      dashboardPage.updateUserRecord(newUser),
    ]);
    const responseBody = await updateResponse.json();

    expect(updateResponse.status()).toBe(200);
    expect(responseBody).toMatchObject({
      id: userId!,
      username: newUser.username,
      name: newUser.name,
    });
    await dashboardPage.verifyToastMessageVisible(
      'Successfully updated record.'
    );
  });

  test('That verify validation errors are shown for invalid or incomplete user update', async ({
    dashboardPage,
  }) => {
    await dashboardPage.updateUserRecord({
      email: INVALID_USERS.badEmail.email,
    });
    await dashboardPage.verifyEmailFieldIsInvalid();

    await dashboardPage.closeFormContainer();
  });
});
