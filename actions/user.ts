import { APIRequestContext } from '@playwright/test';
import { userService } from '@/services';
import { UserRecord } from '@/types';

/**
 * Creates a user record in the database.
 *
 * @param {APIRequestContext} request - The context of the API request.
 * @param {UserRecord} user - The user record to be created.
 *
 * @returns {Promise<UserRecord>} The created user record.
 *
 * @throws {Error} If the action fails.
 */
export const createUserAction = async (
  request: APIRequestContext,
  user: UserRecord
) => {
  try {
    return await userService.create(request, user);
  } catch (error) {
    console.error('Create user action failed:', error);
    throw error;
  }
};

/**
 * Retrieves a user record by ID.
 *
 * @param {APIRequestContext} request - The context of the API request.
 * @param {string} userId - The ID of the user to be retrieved.
 *
 * @returns {Promise<UserRecord>} The user record with the specified ID.
 *
 * @throws {Error} If the action fails.
 */

export const getUserAction = async (
  request: APIRequestContext,
  userId: string
) => {
  try {
    return await userService.getById(request, userId);
  } catch (error) {
    console.error('Get user action failed:', error);
    throw error;
  }
};

/**
 * Updates a user record in the database.
 *
 * @param {APIRequestContext} request - The context of the API request.
 * @param {string} userId - The ID of the user to be updated.
 * @param {UserRecord} updates - The updates to be applied to the user record.
 *
 * @returns {Promise<UserRecord>} The updated user record.
 *
 * @throws {Error} If the action fails.
 */

export const updateUserAction = async (
  request: APIRequestContext,
  userId: string,
  updates: UserRecord
) => {
  try {
    return await userService.update(request, userId, updates);
  } catch (error) {
    console.error('Update user action failed:', error);
    throw error;
  }
};

/**
 * Deletes a user record from the database.
 *
 * @param {APIRequestContext} request - The context of the API request.
 * @param {string} userId - The ID of the user to be deleted.
 *
 * @returns {Promise<void>} A promise that resolves when the user is deleted.
 *
 * @throws {Error} If the action fails.
 */
export const deleteUserAction = async (
  request: APIRequestContext,
  userId: string
) => {
  try {
    return await userService.delete(request, userId);
  } catch (error) {
    console.error('Delete user action failed:', error);
    throw error;
  }
};

/**
 * Searches for user records based on a keyword.
 *
 * @param {APIRequestContext} request - The context of the API request.
 * @param {string} keyword - The keyword to search for in user records.
 *
 * @returns {Promise<any>} A promise that resolves with the search results.
 *
 * @throws {Error} If the search action fails.
 */

export const searchUserAction = async (
  request: APIRequestContext,
  encodedKeyword: string
) => {
  try {
    // Filter across all user fields
    const filterConditions = [
      `id~"${encodedKeyword}"`,
      `email~"${encodedKeyword}"`,
      `username~"${encodedKeyword}"`,
      `name~"${encodedKeyword}"`,
      `password~"${encodedKeyword}"`,
      `tokenKey~"${encodedKeyword}"`,
      `emailVisibility~"${encodedKeyword}"`,
      `verified~"${encodedKeyword}"`,
      `avatar~"${encodedKeyword}"`,
      `website~"${encodedKeyword}"`,
      `created~"${encodedKeyword}"`,
      `updated~"${encodedKeyword}"`,
    ];

    // Join all conditions with OR (||)
    const filter = filterConditions.join('||');
    const encodedFilter = encodeURIComponent(filter);

    return await userService.search(request, encodedFilter);
  } catch (error) {
    console.error('Search user action failed:', error);
    throw error;
  }
};

/**
 * Sorts the list of user records based on a specified column.
 *
 * @param {APIRequestContext} request - The context of the API request.
 * @param {string} sortBy - The column to sort by.
 *
 * @returns {Promise<any>} A promise that resolves with the sorted list of user records.
 *
 * @throws {Error} If the sort action fails.
 */
export const sortUsersAction = async (
  request: APIRequestContext,
  sortBy: string
) => {
  try {
    return await userService.sort(request, sortBy);
  } catch (error) {
    console.error('Sort users action failed:', error);
    throw error;
  }
};
