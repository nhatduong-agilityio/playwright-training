import { test } from '@/fixtures';
import { expect } from '@playwright/test';
import { VALID_USER, INVALID_USERS } from '@/constants';
import {
  createUser,
  deleteUser,
  getUser,
  searchUser,
  sortUsers,
  updateUser,
} from '@/actions';
import { User } from '@/types';

test.describe('User Management API', () => {
  let userId: string | undefined;

  test.afterEach(async ({ apiContext }) => {
    if (userId) {
      await deleteUser(apiContext, userId);
      userId = undefined;
    }
  });

  test('Create user with valid data', async ({ apiContext }) => {
    const email = VALID_USER.email;

    await test.step('Send create user request with valid data', async () => {
      const response = await createUser(apiContext, {
        email,
        password: VALID_USER.password,
        passwordConfirm: VALID_USER.password,
        emailVisibility: true,
      });

      expect(response.ok()).toBeTruthy();
      const body = await response.json();
      expect(body.email).toBe(email);
      userId = body.id;
    });
  });

  test('Create user with invalid data (empty fields)', async ({
    apiContext,
  }) => {
    let res, body;
    await test.step('Send create user request with empty fields', async () => {
      res = await createUser(apiContext, INVALID_USERS.empty);
      expect(res.ok()).toBeFalsy();
      body = await res.json();
      expect(body).toHaveProperty('data');
    });
  });

  test('View user details', async ({ apiContext }) => {
    const email = VALID_USER.email;
    let user: User;
    await test.step('Create user for details view', async () => {
      const createRes = await createUser(apiContext, {
        email,
        password: VALID_USER.password,
        passwordConfirm: VALID_USER.password,
        emailVisibility: true,
      });
      user = await createRes.json();
      userId = user.id;
    });

    // Add a small delay in case of eventual consistency
    await test.step('Wait for user to be available', async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
    });

    await test.step('Get user by ID', async () => {
      if (!user.id) {
        throw new Error('User ID is undefined');
      }
      const res = await getUser(apiContext, user.id);

      expect(res.ok()).toBeTruthy();
      const body = await res.json();
      expect(body.email).toBe(email);
    });
  });

  test('Edit user with valid data', async ({ apiContext }) => {
    const email = VALID_USER.email;
    let user: User;
    await test.step('Create user for update', async () => {
      const createRes = await createUser(apiContext, {
        email,
        password: VALID_USER.password,
        passwordConfirm: VALID_USER.password,
        emailVisibility: true,
      });
      user = await createRes.json();
      userId = user.id;
    });
    await test.step('Update user name', async () => {
      if (!user.id) {
        throw new Error('User ID is undefined');
      }
      const res = await updateUser(apiContext, user.id, {
        ...user,
        name: 'Updated User',
      });
      expect(res.ok()).toBeTruthy();
      const updated = await res.json();
      expect(updated.name).toBe('Updated User');
    });
  });

  test('Edit user with invalid data (bad email)', async ({ apiContext }) => {
    const email = VALID_USER.email;
    let user: User;
    await test.step('Create user for invalid update', async () => {
      const createRes = await createUser(apiContext, {
        email,
        password: VALID_USER.password,
        passwordConfirm: VALID_USER.password,
        emailVisibility: true,
      });
      user = await createRes.json();
      userId = user.id;
    });
    await test.step('Update user with invalid email', async () => {
      if (!user.id) {
        throw new Error('User ID is undefined');
      }
      const res = await updateUser(apiContext, user.id, {
        email: INVALID_USERS.badEmail.email,
      });
      expect(res.ok()).toBeFalsy();
      const body = await res.json();
      expect(body).toHaveProperty('data');
    });
  });

  test('Delete user', async ({ apiContext }) => {
    const email = VALID_USER.email;
    let user: User;
    await test.step('Create user for deletion', async () => {
      const createRes = await createUser(apiContext, {
        email,
        password: VALID_USER.password,
        passwordConfirm: VALID_USER.password,
        emailVisibility: true,
      });
      user = await createRes.json();
    });
    await test.step('Delete user by ID', async () => {
      if (!user.id) {
        throw new Error('User ID is undefined');
      }

      const res = await deleteUser(apiContext, user.id);
      expect(res.ok()).toBeTruthy();
    });
    await test.step('Verify user is deleted', async () => {
      if (!user.id) {
        throw new Error('User ID is undefined');
      }

      const getRes = await getUser(apiContext, user.id);
      expect(getRes.status()).toBe(404);
    });
  });

  test('Sort users by column', async ({ apiContext }) => {
    await test.step('Request users sorted by email', async () => {
      const res = await sortUsers(apiContext, '-email');
      expect(res.ok()).toBeTruthy();
      const body = await res.json();
      expect(Array.isArray(body.items)).toBeTruthy();
    });
  });

  test('Search users by keyword', async ({ apiContext }) => {
    const email = VALID_USER.email;
    let user: User;
    await test.step('Create user for search', async () => {
      const createRes = await createUser(apiContext, {
        email,
        password: VALID_USER.password,
        passwordConfirm: VALID_USER.password,
        emailVisibility: true,
      });
      user = await createRes.json();
      userId = user.id;
    });
    await test.step('Search for user by email', async () => {
      const res = await searchUser(apiContext, email);
      expect(res.ok()).toBeTruthy();
      const body = await res.json();
      expect(body.items.some((u: User) => u.email === email)).toBeTruthy();
    });
  });
});
