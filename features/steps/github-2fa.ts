import { Given, When, Then } from '@/fixtures';
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
  'I enter valid Google email and password',
  async ({ googleLoginPage, validUser }) => {
    await googleLoginPage.enterEmail(validUser.email);
    await googleLoginPage.enterPassword(validUser.password);
  },
);

When(
  'I verify and enter 2FA code using try another way',
  async ({ googleLoginPage }) => {
    await googleLoginPage.clickTryAnotherWay();
    await googleLoginPage.enterVerificationCode();
  },
);

When(
  'I generate and enter real TOTP code',
  async ({ googleLoginPage, generate2FACode }) => {
    const twoFACode = await generate2FACode();
    await googleLoginPage.enter2FACode(twoFACode);
  },
);

When('I allow OAuth permissions', async ({ googleLoginPage }) => {
  await googleLoginPage.allowOAuthPermissions();
});

// Then steps (Verifications)
Then(
  'I should be logged into GitHub successfully',
  async ({ googleLoginPage }) => {
    const isLoggedIn = await googleLoginPage.isLoggedIn();
    expect(isLoggedIn).toBe(true);
  },
);

Then(
  'I should see my username displayed correctly',
  async ({ googleLoginPage, validUser }) => {
    const displayName = await googleLoginPage.getUserDisplayName();
    expect(displayName).toContain(validUser.username);
  },
);
