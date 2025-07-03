import { APIRequestContext } from '@playwright/test';
import { USERS_PATH } from '@/constants';
import { api } from './api';
import { UserRecord } from '@/types';

export const userService = {
  create: async (request: APIRequestContext, user: UserRecord) =>
    await api.post<UserRecord>(request, USERS_PATH, user),
  getById: async (request: APIRequestContext, userId: string) =>
    await api.get(request, `${USERS_PATH}/${userId}`),
  update: async (
    request: APIRequestContext,
    userId: string,
    updates: UserRecord
  ) => await api.patch<UserRecord>(request, `${USERS_PATH}/${userId}`, updates),
  delete: async (request: APIRequestContext, userId: string) =>
    await api.delete(request, `${USERS_PATH}/${userId}`),
  list: async (request: APIRequestContext, params = '') => {
    const query = params ? `?${params}` : '';
    return await api.get(request, `${USERS_PATH}${query}`);
  },
  search: async (request: APIRequestContext, keyword: string) =>
    await api.get(
      request,
      `${USERS_PATH}?filter=${encodeURIComponent(keyword)}`
    ),
};
