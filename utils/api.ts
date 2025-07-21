import { Page } from '@playwright/test';

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
