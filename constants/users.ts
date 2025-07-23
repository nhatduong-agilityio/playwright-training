export const USERS = {
  admin: { email: 'admin@example.com', password: 'admin123' },
  test: { email: 'test@example.com', password: '123456' },
};

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
