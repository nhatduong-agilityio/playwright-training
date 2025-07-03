import { APIRequestContext, APIResponse } from '@playwright/test';
import { BASE_URL } from '@/constants';

const getHeaders = () => {
  const token = process.env.API_BEARER_TOKEN;
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    return {
      ...headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return headers;
};

export const api = {
  get: async (request: APIRequestContext, path: string): Promise<APIResponse> =>
    await request.get(`${BASE_URL}/${path}`, { headers: getHeaders() }),
  post: async <T>(
    request: APIRequestContext,
    path: string,
    data: T
  ): Promise<APIResponse> =>
    await request.post(`${BASE_URL}/${path}`, {
      data,
      headers: getHeaders(),
    }),
  put: async <T>(
    request: APIRequestContext,
    path: string,
    data: T
  ): Promise<APIResponse> =>
    await request.put(`${BASE_URL}/${path}`, {
      data,
      headers: getHeaders(),
    }),
  patch: async <T>(
    request: APIRequestContext,
    path: string,
    data: T
  ): Promise<APIResponse> =>
    await request.patch(`${BASE_URL}/${path}`, {
      data,
      headers: getHeaders(),
    }),
  delete: async (
    request: APIRequestContext,
    path: string
  ): Promise<APIResponse> =>
    await request.delete(`${BASE_URL}/${path}`, {
      headers: getHeaders(),
    }),
};
