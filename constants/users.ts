export const USERS = {
  admin: { email: 'admin@example.com', password: 'admin123' },
  test: { email: 'test@example.com', password: '123456' },
};

export const TEST_USER_EMAIL = 'testuser@example.com';

export const VALID_USER = {
  email: () => `testuser_${Date.now()}@example.com`,
  password: 'Test1234!',
  username: 'testuser',
  name: 'Test User',
};

export const INVALID_USERS = {
  empty: { email: '', password: '' },
  badEmail: { email: 'not-an-email', password: 'Test1234!' },
  mismatchedPassword: {
    email: () => `testuser_${Date.now()}@example.com`,
    password: 'Test1234!',
    passwordConfirm: 'Test5678!',
  },
};
