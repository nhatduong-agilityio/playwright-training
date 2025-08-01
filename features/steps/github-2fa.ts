import { Given, When, Then } from '@/fixtures';
import { getEnvValue } from '@/utils';
import { expect } from '@playwright/test';

// Background steps
Given('I have navigated to GitHub', async ({ googleLoginPage }) => {
  await googleLoginPage.navigateToGitHub();
});

Given('I have clicked the sign in button', async ({ googleLoginPage }) => {
  await googleLoginPage.clickSignInButton();
});

// When steps (Actions)
When('I click Google sign in', async ({ googleLoginPage }) => {
  await googleLoginPage.clickGoogleSignIn();
});

When(
  'I enter {string} and {string} credentials on Google',
  async ({ googleLoginPage }, email: string, password: string) => {
    await googleLoginPage.enterEmail(getEnvValue(email)!);
    await googleLoginPage.enterPassword(getEnvValue(password)!);
  },
);

When(
  'I select the verification from otp code option',
  async ({ googleLoginPage }) => {
    await googleLoginPage.clickTryAnotherWay();
    await googleLoginPage.selectVerificationCode();
  },
);

When(
  'I generate and enter real OTP code',
  async ({ googleLoginPage, generate2FACode }) => {
    const twoFACode = await generate2FACode();
    await googleLoginPage.enter2FACode(twoFACode);
  },
);

When(
  'I allow permissions to login with Google',
  async ({ googleLoginPage }) => {
    await googleLoginPage.allowOAuthPermissions();
  },
);

// Then steps (Verifications)
Then(
  'I should be logged into GitHub successfully',
  async ({ googleLoginPage }) => {
    const isLoggedIn = await googleLoginPage.isLoggedIn();
    expect(isLoggedIn).toBe(true);
  },
);

Then(
  'I should see {string} account name displayed correctly',
  async ({ googleLoginPage }, username: string) => {
    const displayName = await googleLoginPage.getUserDisplayName();
    expect(displayName).toContain(getEnvValue(username));
  },
);
