import { test as base } from '@playwright/test';
import { GoogleLoginPage } from '@/pages';
import { TOTPHelper } from '@/utils';

interface GitHubUser {
  email: string;
  password: string;
  username: string;
  totpSecret?: string;
}

interface LoginFixtures {
  googleLoginPage: GoogleLoginPage;
  validUser: GitHubUser;
  totpHelper: TOTPHelper;
  generate2FACode: () => Promise<string>;
}

export const test = base.extend<LoginFixtures>({
  googleLoginPage: async ({ page }, use) => {
    const googleLoginPage = new GoogleLoginPage(page);
    await use(googleLoginPage);
  },

  validUser: async ({}, use) => {
    const user: GitHubUser = {
      email: process.env.TEST_GOOGLE_EMAIL || 'test.user@gmail.com',
      password: process.env.TEST_GOOGLE_PASSWORD || 'TestPassword123!',
      username: process.env.TEST_GITHUB_USERNAME || 'testuser',
      totpSecret: process.env.TEST_TOTP_SECRET,
    };
    await use(user);
  },

  totpHelper: async ({ validUser }, use) => {
    if (!validUser.totpSecret) {
      throw new Error('TOTP secret is not provided');
    }

    const helper = TOTPHelper.fromBase32Secret(validUser.totpSecret, {
      issuer: 'Google',
      label: validUser.email,
    });

    await use(helper);
  },

  generate2FACode: async ({ totpHelper }, use) => {
    const generator = async () => {
      try {
        const code = totpHelper.generateCode();
        console.log('Generating timed TOTP code...', code);

        return code;
      } catch (error) {
        console.error('Failed to generate timed TOTP code:', error);
        // Fallback to regular generation
        return totpHelper.generateCode();
      }
    };
    await use(generator);
  },
});
