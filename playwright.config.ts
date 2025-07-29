import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig, cucumberReporter } from 'playwright-bdd';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import * as dotenv from 'dotenv';
import * as path from 'path';
import { BASE_URL } from './constants';
dotenv.config({ path: path.resolve(__dirname, '.env') });

const testDir = defineBddConfig({
  features: 'features/*.feature',
  steps: 'features/steps/*.ts',
});

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  tsconfig: './tsconfig.json',
  testDir,
  reporter: [
    cucumberReporter('html', {
      outputFile: './cucumber-report/index.html',
      externalAttachments: true,
    }),
    ['html', { open: 'never' }],
  ],
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    extraHTTPHeaders: {
      Accept: 'application/json',
    },
  },
  timeout: 100 * 1000,

  /* Configure projects for major browsers */
  projects: [
    // Setup project for authentication
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: './.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'API',
      testMatch: /.*api\/.*\.spec\.ts/,
      use: {
        storageState: './.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'Github',
      testMatch: /.*github-login\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        headless: false,
        // Add these properties for better OAuth compatibility
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--disable-blink-features=AutomationControlled',
            '--no-first-run',
            '--no-default-browser-check',
            '--disable-extensions-except',
            '--disable-extensions',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding',
            '--disable-ipc-flooding-protection',
          ],
        },
        // Ignore HTTPS errors if testing on localhost
        ignoreHTTPSErrors: true,
        // Set extra HTTP headers to avoid blocking
        extraHTTPHeaders: {
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          DNT: '1',
          Connection: 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
      },
    },
  ],
});
