import { APIRequestContext, APIResponse } from '@playwright/test';
import { API_URL } from '@/constants';

export const api = {
  get: async (request: APIRequestContext, path: string): Promise<APIResponse> =>
    await request.get(`${API_URL}/${path}`),
  post: async <T>(
    request: APIRequestContext,
    path: string,
    data: T
  ): Promise<APIResponse> =>
    await request.post(`${API_URL}/${path}`, {
      data,
    }),
  put: async <T>(
    request: APIRequestContext,
    path: string,
    data: T
  ): Promise<APIResponse> =>
    await request.put(`${API_URL}/${path}`, {
      data,
    }),
  patch: async <T>(
    request: APIRequestContext,
    path: string,
    data: T
  ): Promise<APIResponse> =>
    await request.patch(`${API_URL}/${path}`, {
      data,
    }),
  delete: async (
    request: APIRequestContext,
    path: string
  ): Promise<APIResponse> => await request.delete(`${API_URL}/${path}`),
};
