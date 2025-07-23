import { APIRequestContext } from '@playwright/test';
import { createUserAction } from '@/actions';
import { VALID_USER } from '@/constants';
import { UserRecord } from '@/types';

/**
 * Creates a specified number of unique users via the API for testing purposes.
 * Each user will have a unique email, username, and name.
 *
 * @param request - The APIRequestContext from Playwright.
 * @param count - The number of users to create.
 * @returns A promise that resolves to an array of created user objects.
 */
export const createMultipleUsers = async (
  request: APIRequestContext,
  count: number
): Promise<UserRecord[]> => {
  const userPromises = Array.from({ length: count }, (_, i) => {
    const email = VALID_USER.email().replace('@', `_test${i}@`);
    const username = `${VALID_USER.username()}_test${i}`;
    const name = `${VALID_USER.name} ${i}`;

    return createUserAction(request, {
      email,
      password: VALID_USER.password,
      passwordConfirm: VALID_USER.password,
      username,
      name,
      emailVisibility: true,
    });
  });

  const responses = await Promise.all(userPromises);
  return Promise.all(responses.map(res => res.json()));
};
