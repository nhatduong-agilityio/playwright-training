import { Given, When, Then, After } from '@/fixtures';
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

After(async ({ apiContext, ctx }) => {
  if (ctx.userId) {
    await deleteUser(apiContext, ctx.userId);
    ctx.userId = undefined;
  }
});

// Background steps
Given('I have access to the user management API', async ({ apiContext }) => {
  expect(apiContext).toBeDefined();
});

Given('I have created a user with valid data', async ({ apiContext, ctx }) => {
  const email = VALID_USER.email;

  const response = await createUser(apiContext, {
    email,
    password: VALID_USER.password,
    passwordConfirm: VALID_USER.password,
    emailVisibility: true,
  });

  const body = await response.json();

  ctx.user = body;
  ctx.userId = body.id;
  ctx.response = response;
  ctx.responseBody = body;
});

// Create user steps
When(
  'I create a user with valid email and password',
  async ({ apiContext, ctx }) => {
    const email = VALID_USER.email;

    ctx.response = await createUser(apiContext, {
      email,
      password: VALID_USER.password,
      passwordConfirm: VALID_USER.password,
      emailVisibility: true,
    });

    ctx.responseBody = await ctx.response.json();
    ctx.userId = ctx.responseBody.id;
    ctx.user = ctx.responseBody;
  }
);

When(
  'I attempt to create a user with empty fields',
  async ({ apiContext, ctx }) => {
    ctx.response = await createUser(apiContext, INVALID_USERS.empty);
    ctx.responseBody = await ctx.response.json();
  }
);

Then('the user should be created successfully', async ({ ctx }) => {
  expect(ctx.response?.ok()).toBeTruthy();
});

Then('the response should contain the user email', async ({ ctx }) => {
  expect(ctx.responseBody.email).toBe(VALID_USER.email);
});

Then('the user should have a valid ID', async ({ ctx }) => {
  expect(ctx.responseBody.id).toBeDefined();
  expect(typeof ctx.responseBody.id).toBe('string');
});

Then('the request should fail', async ({ ctx }) => {
  expect(ctx.response?.ok()).toBeFalsy();
});

Then('the response should contain validation errors', async ({ ctx }) => {
  expect(ctx.responseBody).toHaveProperty('data');
});

// View user steps
When('I request the user details by ID', async ({ apiContext, ctx }) => {
  if (!ctx.user?.id) {
    throw new Error('No created user ID available');
  }

  ctx.response = await getUser(apiContext, ctx.user.id);
  ctx.responseBody = await ctx.response.json();
});

Then('I should receive the user information', async ({ ctx }) => {
  expect(ctx.response?.ok()).toBeTruthy();
});

Then('the email should match the created user', async ({ ctx }) => {
  expect(ctx.responseBody.email).toBe(ctx.user?.email);
});

// Update user steps
When(
  'I update the user name to {string}',
  async ({ apiContext, ctx }, newName: string) => {
    if (!ctx.user?.id) {
      throw new Error('No created user ID available');
    }

    ctx.response = await updateUser(apiContext, ctx.user.id, {
      ...ctx.user,
      name: newName,
    });

    ctx.responseBody = await ctx.response.json();
  }
);

When(
  'I attempt to update the user with an invalid email',
  async ({ apiContext, ctx }) => {
    if (!ctx.user?.id) {
      throw new Error('No created user ID available');
    }

    ctx.response = await updateUser(apiContext, ctx.user.id, {
      email: INVALID_USERS.badEmail.email,
    });

    ctx.responseBody = await ctx.response.json();
  }
);

Then('the user should be updated successfully', async ({ ctx }) => {
  expect(ctx.response?.ok()).toBeTruthy();
});

Then(
  'the user name should be {string}',
  async ({ ctx }, expectedName: string) => {
    expect(ctx.responseBody.name).toBe(expectedName);
  }
);

Then('the update should fail', async ({ ctx }) => {
  expect(ctx.response?.ok()).toBeFalsy();
});

// Delete user steps
When('I delete the user by ID', async ({ apiContext, ctx }) => {
  if (!ctx.user?.id) {
    throw new Error('No created user ID available');
  }

  ctx.response = await deleteUser(apiContext, ctx.user.id);
});

Then('the user should be deleted successfully', async ({ ctx }) => {
  expect(ctx.response?.ok()).toBeTruthy();
});

Then(
  'requesting the user details should return 404',
  async ({ apiContext, ctx }) => {
    if (!ctx.user?.id) {
      throw new Error('No created user ID available');
    }

    const getResponse = await getUser(apiContext, ctx.user.id);
    expect(getResponse.status()).toBe(404);
  }
);

// Sort users steps
When(
  'I request users sorted by email in descending order',
  async ({ apiContext, ctx }) => {
    ctx.response = await sortUsers(apiContext, '-email');
    ctx.responseBody = await ctx.response.json();
  }
);

Then('the request should be successful', async ({ ctx }) => {
  expect(ctx.response?.ok()).toBeTruthy();
});

Then('the response should contain a list of users', async ({ ctx }) => {
  expect(Array.isArray(ctx.responseBody.items)).toBeTruthy();
});

// Search users steps
When('I search for users by email', async ({ apiContext, ctx }) => {
  if (!ctx.user?.email) {
    throw new Error('No created user email available');
  }

  ctx.response = await searchUser(apiContext, ctx.user.email);
  ctx.responseBody = await ctx.response.json();
});

Then('the search should be successful', async ({ ctx }) => {
  expect(ctx.response?.ok()).toBeTruthy();
});

Then('the results should contain the created user', async ({ ctx }) => {
  const userFound = ctx.responseBody.items.some(
    (u: User) => u.email === ctx.user?.email
  );
  expect(userFound).toBeTruthy();
});

// Generic response validation steps
Then('status is {int}', async ({ ctx }, status: number) => {
  expect(ctx.response?.status()).toEqual(status);
});

Then('response has prop {string}', async ({ ctx }, keyPath: string) => {
  expect(ctx.responseBody).toHaveProperty(keyPath);
});

Then(
  'response has prop {string} = {int}',
  async ({ ctx }, keyPath: string, value: number) => {
    expect(ctx.responseBody).toHaveProperty(keyPath, value);
  }
);

Then(
  'response has prop {string} = {string}',
  async ({ ctx }, keyPath: string, value: string) => {
    expect(ctx.responseBody).toHaveProperty(keyPath, value);
  }
);

Then('response object matches:', async ({ ctx }, data: string) => {
  expect(ctx.responseBody).toMatchObject(JSON.parse(data));
});

Then('response array contains:', async ({ ctx }, data: string) => {
  expect(ctx.responseBody).toContainEqual(
    expect.objectContaining(JSON.parse(data))
  );
});
