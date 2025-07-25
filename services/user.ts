import { APIRequestContext } from '@playwright/test';
import { USERS_PATH } from '@/constants';
import { api } from './api';
import { User } from '@/types';

export const userService = {
  create: async (request: APIRequestContext, user: User) =>
    await api.post<User>(request, USERS_PATH, user),
  getById: async (request: APIRequestContext, userId: string) =>
    await api.get(request, `${USERS_PATH}/${userId}`),
  update: async (
    request: APIRequestContext,
    userId: string,
    updates: User
  ) => await api.patch<User>(request, `${USERS_PATH}/${userId}`, updates),
  delete: async (request: APIRequestContext, userId: string) =>
    await api.delete(request, `${USERS_PATH}/${userId}`),
  list: async (request: APIRequestContext, params = '') => {
    const query = params ? `?${params}` : '';
    return await api.get(request, `${USERS_PATH}${query}`);
  },
  search: async (request: APIRequestContext, keyword: string) =>
    await api.get(request, `${USERS_PATH}?filter=${keyword}`),
  sort: async (request: APIRequestContext, sortBy: string) =>
    await api.get(request, `${USERS_PATH}?sort=${sortBy}`),
};
