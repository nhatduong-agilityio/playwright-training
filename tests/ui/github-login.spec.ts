import { test } from '@/fixtures/github-authentication-fixtures';
import { expect } from '@playwright/test';

test.describe('GitHub Google OAuth Login with 2FA', () => {
  test.beforeEach(async ({ googleLoginPage }) => {
    await googleLoginPage.navigateToGitHub();
    await googleLoginPage.clickSignInButton();
  });

  test('should login successfully with valid Google credentials and real TOTP', async ({
    googleLoginPage,
    validUser,
    generate2FACode,
  }) => {
    await test.step('Login with valid Google credentials', async () => {
      await googleLoginPage.clickGoogleSignIn();
    });

    await test.step('Enter valid email and password', async () => {
      await googleLoginPage.enterEmail(validUser.email);
      await googleLoginPage.enterPassword(validUser.password);
    });

    await test.step('Verify and enter 2FA code', async () => {
      await googleLoginPage.clickTryAnotherWay();
      await googleLoginPage.enterVerificationCode();
    });

    await test.step('Generate real TOTP code with timing consideration and enter it', async () => {
      const twoFACode = await generate2FACode();
      await googleLoginPage.enter2FACode(twoFACode);
    });

    await test.step('Verify successful login to GitHub', async () => {
      await googleLoginPage.allowOAuthPermissions();
    });

    await test.step('Verify user is displayed correctly', async () => {
      // Verify successful login to GitHub
      const isLoggedIn = await googleLoginPage.isLoggedIn();
      expect(isLoggedIn).toBe(true);
    });

    await test.step('Verify user is displayed correctly', async () => {
      // Verify user is displayed correctly
      const displayName = await googleLoginPage.getUserDisplayName();
      expect(displayName).toContain(validUser.username);
    });
  });
});
