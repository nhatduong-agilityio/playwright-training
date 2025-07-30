import { When, Then } from '@/fixtures';
import { expect } from '@playwright/test';
import { waitForResponseFromMethodDelete } from '@/utils';
import { USERS_PATH } from '@/constants';

When('I delete the first seeded user', async ({ tablePage, page, ctx }) => {
  const [deleteResponse] = await Promise.all([
    waitForResponseFromMethodDelete({
      page,
      url: USERS_PATH,
      id: ctx.seededUsers![0].id!,
    }),
    tablePage.deleteRowSelected('id', ctx.seededUsers![0].id!),
  ]);
  ctx.response = deleteResponse;
});

Then('the user should be deleted successfully with status {int}', async ({ ctx }, expectedStatus: number) => {
  expect(ctx.response?.status()).toBe(expectedStatus);
});

Then('the user should no longer appear in the table', async ({ dashboardPage, tablePage, ctx }) => {
  await dashboardPage.refreshButton.click();
  await tablePage.waitForTableReady();
  await tablePage.expectRowNotVisible('id', ctx.seededUsers![0].id!);
});
