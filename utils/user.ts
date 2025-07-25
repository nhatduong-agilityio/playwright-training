import test, { APIRequestContext } from '@playwright/test';
import { createUser } from '@/actions';
import { VALID_USER } from '@/constants';
import { User } from '@/types';

/**
 * Creates a specified number of unique users via the API for testing purposes.
 * Each user will have a unique email, username, and name.
 *
 * @param request - The APIRequestContext from Playwright.
 * @param count - The number of users to create.
 * @param specialString - An optional string to include in the email and username.
 * @returns A promise that resolves to an array of created user objects.
 */
export const createMultipleUsers = async (
  request: APIRequestContext,
  count: number,
  specialString?: string
): Promise<User[]> => {
  const randomId = Math.floor(Math.random() * 1000000).toString();
  const workerIndex = test.info().workerIndex;

  const userPromises = Array.from({ length: count }, _ => {
    // Combine worker index, timestamp, and loop index for high uniqueness
    const uniqueSuffix = `${workerIndex}_${Date.now()}_${randomId}`;

    const email = `user_${uniqueSuffix}${specialString ? `_${specialString}` : ''}@example.com`;
    const username = `user_${uniqueSuffix}${specialString ? `_${specialString}` : ''}`;
    const name = `User Name ${uniqueSuffix}${specialString ? ` ${specialString}` : ''}`;

    return createUser(request, {
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

/**
 * Encodes a keyword into a filter string for user search.
 *
 * @param encodedKeyword - The keyword to encode.
 * @returns The encoded filter string.
 */
export function getEncodedUserSearchFilter(encodedKeyword: string): string {
  const keys = [
    'id',
    'email',
    'username',
    'name',
    'password',
    'tokenKey',
    'emailVisibility',
    'verified',
    'avatar',
    'website',
    'created',
    'updated',
  ];

  const filterConditions = keys.map(key => `${key}~"${encodedKeyword}"`);
  const filter = filterConditions.join('||');
  return encodeURIComponent(filter);
}
