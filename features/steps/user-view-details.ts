import { When, Then } from '@/fixtures';
import { waitForResponseFromMethodGet } from '@/utils';
import { USERS_PATH } from '@/constants/urls';

When(
  'I open and wait for view the details for the first seeded user',
  async ({ tablePage, page, ctx }) => {
    const [response] = await Promise.all([
      waitForResponseFromMethodGet({ page, url: USERS_PATH }),
      tablePage.openRowDetails('id', ctx.seededUsers![0].id!),
    ]);

    ctx.response = response;
    ctx.user = await response.json();
  },
);

Then(
  'I should see the user details displayed correctly',
  async ({ dashboardPage, ctx }) => {
    await dashboardPage.expectUserDetails(ctx.user!);
  },
);
