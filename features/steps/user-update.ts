import { Given, When, Then } from '@/fixtures';
import { expect } from '@playwright/test';
import { waitForResponseFromMethodPatch } from '@/utils';
import { USERS_PATH } from '@/constants';

Given(
  'I open the details for the first seeded user',
  async ({ tablePage, ctx }) => {
    await tablePage.expectRowData(
      'id',
      ctx.seededUsers![0].id!,
      ctx.seededUsers![0],
    );
    await tablePage.openRowDetails('id', ctx.seededUsers![0].id!);
  },
);

When(
  'I update the user with the following data:',
  async ({ dashboardPage, page, ctx }, dataTable) => {
    const userData = dataTable.rowsHash();

    const [updateResponse] = await Promise.all([
      waitForResponseFromMethodPatch({
        page,
        url: USERS_PATH,
        id: ctx.seededUsers![0].id!,
      }),
      dashboardPage.editUser({
        username: userData.username,
        name: userData.name,
      }),
    ]);

    ctx.response = updateResponse;
    ctx.user = await updateResponse.json();
  },
);

When(
  'I attempt to update the user with invalid email {string}',
  async ({ dashboardPage }, invalidEmail: string) => {
    await dashboardPage.editUser({
      email: invalidEmail,
    });
  },
);

Then(
  'the user should be updated successfully with status {int}',
  async ({ ctx }, expectedStatus: number) => {
    expect(ctx.response?.status()).toBe(expectedStatus);

    const userUpdated = ctx.user;
    expect(userUpdated).toMatchObject({
      id: ctx.seededUsers![0].id!,
      username: 'updated_username',
      name: 'Updated Name',
    });
  },
);
