import { INVALID_USERS, USERS_PATH } from '@/constants';
import { test } from '@/fixtures';
import { waitForResponseFromMethodPatch } from '@/utils';
import { expect } from '@playwright/test';

test.describe('Update User Record', () => {
  test.beforeEach(async ({ userContext, dashboardPage }) => {
    await test.step('Go to dashboard', async () => {
      await dashboardPage.goto();
      await dashboardPage.verifyAmOnDashboardPage();
    });

    await test.step('Refresh table', async () => {
      await dashboardPage.refreshTable();
      await dashboardPage.verifyUserIsCreated(userContext[0].email);
      await dashboardPage.viewUserDetails(userContext[0].id!);
    });
  });

  test('That verify user can update an existing user with valid data', async ({
    dashboardPage,
    userContext,
    page,
  }) => {
    const newUser = {
      username: 'updated_username',
      name: 'Updated Name',
    };

    await test.step('Update user record', async () => {
      const [updateResponse] = await Promise.all([
        waitForResponseFromMethodPatch({
          page,
          url: USERS_PATH,
          id: userContext[0].id!,
        }),
        dashboardPage.updateUserRecord(newUser),
      ]);
      const responseBody = await updateResponse.json();

      expect(updateResponse.status()).toBe(200);
      expect(responseBody).toMatchObject({
        id: userContext[0].id!,
        username: newUser.username,
        name: newUser.name,
      });
    });

    await test.step('Verify user record is updated', async () => {
      await dashboardPage.verifyToastMessageVisible(
        'Successfully updated record.'
      );
    });
  });

  test('That verify validation errors are shown for invalid or incomplete user update', async ({
    dashboardPage,
  }) => {
    await test.step('Attempt to update user with invalid data', async () => {
      await dashboardPage.updateUserRecord({
        email: INVALID_USERS.badEmail.email,
      });
    });

    await test.step('Verify validation errors are displayed', async () => {
      await dashboardPage.verifyEmailFieldIsInvalid();
      await dashboardPage.closeFormContainer();
    });
  });
});
