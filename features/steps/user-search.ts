import { Given, When, Then } from '@/fixtures';
import { waitForResponseFromMethodGet } from '@/utils';
import { USERS_PATH } from '@/constants';
import { User } from '@/types';

When(
  "I search for users by {string} with the first seeded user's {string} value",
  async (
    { seededUsers, dashboardPage, page, ctx },
    _,
    searchField: keyof User,
  ) => {
    const keyword: string = seededUsers[0][searchField] as string;
    const [searchResponse] = await Promise.all([
      waitForResponseFromMethodGet({ page, url: USERS_PATH }),
      dashboardPage.searchRecords(keyword),
    ]);
    ctx.response = searchResponse;
    ctx.responseBody = await searchResponse.json();
    ctx.seededUsers = ctx.responseBody.items;
  },
);

Then(
  'the user should appear in the search results',
  async ({ tablePage, ctx }) => {
    const users = ctx.seededUsers!;
    await tablePage.expectRowData('email', users[0].email, users[0]);
  },
);

Given('I have performed a search', async ({ dashboardPage }) => {
  await dashboardPage.searchRecords('test');
});

When('I clear the search', async ({ dashboardPage }) => {
  await dashboardPage.clearSearchButton();
});

Then('all users should be visible again', async ({ tablePage, ctx }) => {
  for (const user of ctx.seededUsers!) {
    await tablePage.expectRowData('id', user.id!, user);
  }
});
