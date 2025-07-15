import { test, expect } from '@playwright/test';
import { VALID_USER, INVALID_USERS } from '@/constants';
import {
  createUserAction,
  deleteUserAction,
  getUserAction,
  searchUserAction,
  sortUsersAction,
  updateUserAction,
} from '@/actions';
import { UserRecord } from '@/types';

test.describe('User Management API', () => {
  let createdUserId: string | undefined;

  test.afterEach(async ({ request }) => {
    if (createdUserId) {
      await deleteUserAction(request, createdUserId);
      createdUserId = undefined;
    }
  });

  test('Create user with valid data', async ({ request }) => {
    const email = VALID_USER.email();

    await test.step('Send create user request with valid data', async () => {
      const response = await createUserAction(request, {
        email,
        password: VALID_USER.password,
        passwordConfirm: VALID_USER.password,
        emailVisibility: true,
      });

      expect(response.ok()).toBeTruthy();
      const body = await response.json();
      expect(body.email).toBe(email);
      createdUserId = body.id;
    });
  });

  test('Create user with invalid data (empty fields)', async ({ request }) => {
    let res, body;
    await test.step('Send create user request with empty fields', async () => {
      res = await createUserAction(request, INVALID_USERS.empty);
      expect(res.ok()).toBeFalsy();
      body = await res.json();
      expect(body).toHaveProperty('data');
    });
  });

  test('View user details', async ({ request }) => {
    const email = VALID_USER.email();
    let user: UserRecord;
    await test.step('Create user for details view', async () => {
      const createRes = await createUserAction(request, {
        email,
        password: VALID_USER.password,
        passwordConfirm: VALID_USER.password,
        emailVisibility: true,
      });
      user = await createRes.json();
      createdUserId = user.id;
    });

    // Add a small delay in case of eventual consistency
    await test.step('Wait for user to be available', async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
    });

    await test.step('Get user by ID', async () => {
      if (!user.id) {
        throw new Error('User ID is undefined');
      }
      const res = await getUserAction(request, user.id);

      expect(res.ok()).toBeTruthy();
      const body = await res.json();
      expect(body.email).toBe(email);
    });
  });

  test('Edit user with valid data', async ({ request }) => {
    const email = VALID_USER.email();
    let user: UserRecord;
    await test.step('Create user for update', async () => {
      const createRes = await createUserAction(request, {
        email,
        password: VALID_USER.password,
        passwordConfirm: VALID_USER.password,
        emailVisibility: true,
      });
      user = await createRes.json();
      createdUserId = user.id;
    });
    await test.step('Update user name', async () => {
      if (!user.id) {
        throw new Error('User ID is undefined');
      }
      const res = await updateUserAction(request, user.id, {
        ...user,
        name: 'Updated User',
      });
      expect(res.ok()).toBeTruthy();
      const updated = await res.json();
      expect(updated.name).toBe('Updated User');
    });
  });

  test('Edit user with invalid data (bad email)', async ({ request }) => {
    const email = VALID_USER.email();
    let user: UserRecord;
    await test.step('Create user for invalid update', async () => {
      const createRes = await createUserAction(request, {
        email,
        password: VALID_USER.password,
        passwordConfirm: VALID_USER.password,
        emailVisibility: true,
      });
      user = await createRes.json();
      createdUserId = user.id;
    });
    await test.step('Update user with invalid email', async () => {
      if (!user.id) {
        throw new Error('User ID is undefined');
      }
      const res = await updateUserAction(request, user.id, {
        email: INVALID_USERS.badEmail.email,
      });
      expect(res.ok()).toBeFalsy();
      const body = await res.json();
      expect(body).toHaveProperty('data');
    });
  });

  test('Delete user', async ({ request }) => {
    const email = VALID_USER.email();
    let user: UserRecord;
    await test.step('Create user for deletion', async () => {
      const createRes = await createUserAction(request, {
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

      const res = await deleteUserAction(request, user.id);
      expect(res.ok()).toBeTruthy();
    });
    await test.step('Verify user is deleted', async () => {
      if (!user.id) {
        throw new Error('User ID is undefined');
      }

      const getRes = await getUserAction(request, user.id);
      expect(getRes.status()).toBe(404);
    });
  });

  test('Sort users by column', async ({ request }) => {
    await test.step('Request users sorted by email', async () => {
      const res = await sortUsersAction(request, '-email');
      expect(res.ok()).toBeTruthy();
      const body = await res.json();
      expect(Array.isArray(body.items)).toBeTruthy();
    });
  });

  test('Search users by keyword', async ({ request }) => {
    const email = VALID_USER.email();
    let user: UserRecord;
    await test.step('Create user for search', async () => {
      const createRes = await createUserAction(request, {
        email,
        password: VALID_USER.password,
        passwordConfirm: VALID_USER.password,
        emailVisibility: true,
      });
      user = await createRes.json();
      createdUserId = user.id;
    });
    await test.step('Search for user by email', async () => {
      const res = await searchUserAction(request, email);
      expect(res.ok()).toBeTruthy();
      const body = await res.json();
      expect(
        body.items.some((u: UserRecord) => u.email === email)
      ).toBeTruthy();
    });
  });
});
