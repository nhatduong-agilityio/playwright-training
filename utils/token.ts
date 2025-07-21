import * as path from 'path';
import * as fs from 'fs';
import { BASE_URL } from '@/constants';

/**
 * Extracts the access token from the saved storage state file.
 * The storage state is created by the authentication setup.
 *
 * @returns {string} The access token, or an empty string if not found.
 */
export const extractAccessToken = (): string => {
  const authFile = path.resolve(__dirname, '../tests/auth/user.json');

  try {
    if (!fs.existsSync(authFile)) {
      console.warn(`Authentication state file not found at: ${authFile}`);
      return '';
    }

    const authFileContent = fs.readFileSync(authFile, 'utf-8');
    const storageState = JSON.parse(authFileContent);

    // The origin in the storage state is the base of the URL (e.g., 'https://pocketbase.io')
    // We derive it from the full BASE_URL to ensure a match.
    const targetOrigin = new URL(process.env.BASE_URL || BASE_URL).origin;

    const originData = storageState.origins?.find(
      (o: { origin: string }) => o.origin === targetOrigin
    );

    if (!originData) {
      console.warn(`Origin ${targetOrigin} not found in storage state file.`);
      return '';
    }

    const localStorageAuthKey = '__pb_superuser_auth__';
    const authItem = originData.localStorage?.find(
      (item: { name: string }) => item.name === localStorageAuthKey
    );

    if (authItem?.value) {
      const authValue = JSON.parse(authItem.value);
      return authValue.token || '';
    }
  } catch (error) {
    console.error('Failed to extract access token from storage state.', error);
  }

  return '';
};
