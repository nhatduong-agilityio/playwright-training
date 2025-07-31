import { When, Then } from '@/fixtures';
import { waitForResponseFromMethodGet } from '@/utils';
import { USERS_PATH } from '@/constants';

When(
  'I sort users by {string} in ascending order',
  async ({ tablePage, page, ctx }, field: string) => {
    const [getResponse] = await Promise.all([
      waitForResponseFromMethodGet({ page, url: USERS_PATH }),
      tablePage.sortByField(field),
    ]);
    ctx.response = getResponse;
  },
);

When(
  'I sort users by {string} in descending order',
  async ({ tablePage, page, ctx }, field: string) => {
    const [getResponse] = await Promise.all([
      waitForResponseFromMethodGet({ page, url: USERS_PATH }),
      tablePage.sortByField(field),
    ]);
    ctx.response = getResponse;
  },
);

Then(
  'the users should be sorted by {string} in ascending order',
  async ({ tablePage }, field: string) => {
    await tablePage.expectSortedByField({ field, order: 'asc' });
  },
);

Then(
  'the users should be sorted by {string} in descending order',
  async ({ tablePage }, field: string) => {
    await tablePage.expectSortedByField({ field, order: 'desc' });
  },
);
