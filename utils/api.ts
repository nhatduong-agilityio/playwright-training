import { Page } from '@playwright/test';

/**
 * Waits for a response from a DELETE request to the specified URL with the given ID.
 *
 * @param {Page} page - The page to wait on.
 * @param {string} url - The base URL of the request.
 * @param {string} id - The ID of the resource to be deleted.
 * @returns {Promise<APIResponse<unknown>>} - A promise resolving to the response.
 */
export const waitForResponseFromMethodDelete = async ({
  page,
  url,
  id,
}: {
  page: Page;
  url: string;
  id: string;
}) =>
  page.waitForResponse(res => {
    const decodedURL = decodeURIComponent(res.url());
    return (
      decodedURL.includes(`${url}/${id}`) && res.request().method() === 'DELETE'
    );
  });

/**
 * Waits for a response from a GET request to the specified URL.
 *
 * @param {{url: string, page: Page}} options - The options to wait for the response.
 * @param {string} options.url - The base URL of the request.
 * @param {Page} options.page - The page to wait on.
 * @returns {Promise<APIResponse<unknown>>} - A promise resolving to the response.
 */
export const waitForResponseFromMethodGet = ({
  url,
  page,
}: {
  url: string;
  page: Page;
}) =>
  page.waitForResponse(res => {
    const decodedURL = decodeURIComponent(res.url());

    return (
      decodedURL.includes(url) &&
      !decodedURL.includes('fields=id') &&
      res.request().method() === 'GET'
    );
  });

/**
 * Waits for a response from a POST request to the specified URL.
 *
 * @param {{url: string, page: Page}} options - The options to wait for the response.
 * @param {string} options.url - The base URL of the request.
 * @param {Page} options.page - The page to wait on.
 * @returns {Promise<APIResponse<unknown>>} - A promise resolving to the response.
 */
export const waitResponseFromMethodPost = ({
  url,
  page,
}: {
  url: string;
  page: Page;
}) =>
  page.waitForResponse(
    response =>
      response.url().includes(url) && response.request().method() === 'POST'
  );

/**
 * Waits for a response from a PATCH request to the specified URL with the given ID.
 *
 * @param {{page: Page, url: string, id: string}} options - The options to wait for the response.
 * @param {Page} options.page - The page to wait on.
 * @param {string} options.url - The base URL of the request.
 * @param {string} options.id - The ID of the resource to be updated.
 * @returns {Promise<APIResponse<unknown>>} - A promise resolving to the response.
 */
export const waitForResponseFromMethodPatch = ({
  page,
  url,
  id,
}: {
  page: Page;
  url: string;
  id: string;
}) =>
  page.waitForResponse(
    response =>
      response.url().includes(`${url}/${id}`) &&
      response.request().method() === 'PATCH'
  );
