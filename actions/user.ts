import { APIRequestContext } from '@playwright/test';
import { userService } from '@/services';
import { User } from '@/types';
import { getEncodedUserSearchFilter } from '@/utils';

/**
 * Creates a user record in the database.
 *
 * @param {APIRequestContext} request - The context of the API request.
 * @param {User} user - The user record to be created.
 *
 * @returns {Promise<User>} The created user record.
 *
 * @throws {Error} If the action fails.
 */
export const createUser = async (request: APIRequestContext, user: User) => {
  try {
    return await userService.create(request, user);
  } catch (error) {
    console.error('Create user failed:', error);
    throw error;
  }
};

/**
 * Retrieves a user record by ID.
 *
 * @param {APIRequestContext} request - The context of the API request.
 * @param {string} userId - The ID of the user to be retrieved.
 *
 * @returns {Promise<User>} The user record with the specified ID.
 *
 * @throws {Error} If the action fails.
 */

export const getUser = async (request: APIRequestContext, userId: string) => {
  try {
    return await userService.getById(request, userId);
  } catch (error) {
    console.error('Get user failed:', error);
    throw error;
  }
};

/**
 * Updates a user record in the database.
 *
 * @param {APIRequestContext} request - The context of the API request.
 * @param {string} userId - The ID of the user to be updated.
 * @param {User} updates - The updates to be applied to the user record.
 *
 * @returns {Promise<User>} The updated user record.
 *
 * @throws {Error} If the action fails.
 */

export const updateUser = async (
  request: APIRequestContext,
  userId: string,
  updates: User,
) => {
  try {
    return await userService.update(request, userId, updates);
  } catch (error) {
    console.error('Update user failed:', error);
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
export const deleteUser = async (
  request: APIRequestContext,
  userId: string,
) => {
  try {
    return await userService.delete(request, userId);
  } catch (error) {
    console.error('Delete user failed:', error);
    throw error;
  }
};

/**
 * Searches for user records based on a keyword.
 *
 * @param {APIRequestContext} request - The context of the API request.
 * @param {string} encodedKeyword - The keyword to search for in user records.
 *
 * @returns {Promise<APIResponse>} A promise that resolves with the search results.
 *
 * @throws {Error} If the search action fails.
 */
export const searchUser = async (
  request: APIRequestContext,
  encodedKeyword: string,
) => {
  try {
    const encodedFilter = getEncodedUserSearchFilter(encodedKeyword);
    return await userService.search(request, encodedFilter);
  } catch (error) {
    console.error('Search user failed:', error);
    throw error;
  }
};

/**
 * Sorts the list of user records based on a specified column.
 *
 * @param {APIRequestContext} request - The context of the API request.
 * @param {string} sortBy - The column to sort by.
 *
 * @returns {Promise<APIResponse>} A promise that resolves with the sorted list of user records.
 *
 * @throws {Error} If the sort action fails.
 */
export const sortUsers = async (request: APIRequestContext, sortBy: string) => {
  try {
    return await userService.sort(request, sortBy);
  } catch (error) {
    console.error('Sort users failed:', error);
    throw error;
  }
};
