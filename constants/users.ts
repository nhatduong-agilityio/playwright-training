export const VALID_USER = {
  email: `user_${Date.now()}@example.com`,
  password: 'User1234!',
  username: `user_${Date.now()}`,
  name: 'User Name',
};

export const INVALID_USERS = {
  empty: { email: '', password: '' },
  badEmail: { email: 'not-an-email@gmail', password: 'Test1234!' },
  mismatchedPassword: {
    email: () => `testuser-${Date.now()}@example.com`,
    password: 'Test1234!',
    passwordConfirm: 'Test5678!',
  },
};

export const USERS = {
  test: {
    email: 'test@example.com',
    password: '123456',
    username: 'test',
    name: 'Test User',
  },
  google: {
    email: process.env.TEST_GOOGLE_EMAIL || 'test.user@gmail.com',
    password: process.env.TEST_GOOGLE_PASSWORD || 'TestPassword123!',
    username: process.env.TEST_GITHUB_USERNAME || 'testuser',
    name: process.env.TEST_GITHUB_NAME || 'Test User',
  },
};
