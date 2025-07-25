import { INVALID_USERS, USERS_PATH, EMAIL_INVALID_ERROR } from '@/constants';
import { usersFixture as test } from '@/fixtures';
import { waitForResponseFromMethodPatch } from '@/utils';
import { expect } from '@playwright/test';

test.describe('Update User Record', () => {
  test.beforeEach(async ({ seededUsers, dashboardPage }) => {
    await test.step('Go to dashboard', async () => {
      await dashboardPage.goto();
      await dashboardPage.expectOnDashboard();
    });

    await test.step('Refresh table', async () => {
      await dashboardPage.refreshButton.click();
      await dashboardPage.expectRowData(
        'id',
        seededUsers[0].id!,
        seededUsers[0]
      );
      await dashboardPage.openRowDetails('id', seededUsers[0].id!);
    });
  });

  test('That verify user can update an existing user with valid data', async ({
    dashboardPage,
    seededUsers,
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
          id: seededUsers[0].id!,
        }),
        dashboardPage.editUser(newUser),
      ]);
      const userUpdated = await updateResponse.json();

      await expect(updateResponse.status()).toBe(200);
      await expect(userUpdated).toMatchObject({
        id: seededUsers[0].id!,
        username: newUser.username,
        name: newUser.name,
      });
    });

    await test.step('Verify user record is updated', async () => {
      await dashboardPage.expectToast('Successfully updated record.');
    });
  });

  test('That verify validation errors are shown for invalid or incomplete user update', async ({
    dashboardPage,
  }) => {
    await test.step('Attempt to update user with invalid data', async () => {
      await dashboardPage.editUser({
        email: INVALID_USERS.badEmail.email,
      });
    });

    await test.step('Verify validation errors are displayed', async () => {
      await dashboardPage.expectFieldError(
        EMAIL_INVALID_ERROR,
        dashboardPage.container
      );
      await dashboardPage.closeUserForm();
    });
  });
});
