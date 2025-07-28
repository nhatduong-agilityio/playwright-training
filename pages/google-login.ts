import { Page, Locator, expect } from '@playwright/test';

export class GoogleLoginPage {
  readonly page: Page;
  readonly googleSignInButton: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly nextButton: Locator;
  readonly twoFactorInput: Locator;
  readonly tryAnotherWayButton: Locator;
  readonly verificationCodeLink: Locator;
  readonly allowAccessButton: Locator;
  readonly userAvatar: Locator;

  constructor(page: Page) {
    this.page = page;
    // GitHub login elements
    this.googleSignInButton = page.getByRole('button', {
      name: 'Continue with Google',
    });

    // Google OAuth elements
    this.emailInput = page.getByRole('textbox', { name: 'Enter your email' });
    this.passwordInput = page.getByRole('textbox', {
      name: 'Enter your password',
    });
    this.nextButton = page.getByRole('button', { name: 'Next' });

    // 2FA elements
    this.tryAnotherWayButton = page.getByRole('button', {
      name: 'Try another way',
    });
    this.verificationCodeLink = page.getByRole('link', {
      name: 'Get a verification code from',
    });
    this.allowAccessButton = page.getByRole('button', { name: 'Continue' });
    this.twoFactorInput = page.getByRole('textbox', { name: 'Enter code' });
    this.userAvatar = page.getByRole('button', {
      name: 'Open user navigation menu',
    });
  }

  async navigateToGitHub() {
    await this.page.goto('https://github.com/');
    await expect(this.page).toHaveTitle(/GitHub/);
  }

  async clickSignInButton() {
    const signInButton = this.page
      .getByRole('link', { name: 'Sign in' })
      .first();
    await signInButton.click();
    await this.page.waitForURL('**/github.com/login**');
  }

  async clickGoogleSignIn() {
    await this.googleSignInButton.click();
    // Wait for redirect to Google OAuth
    await this.page.waitForURL('**/accounts.google.com/**');
  }

  async enterEmail(email: string) {
    await this.emailInput.fill(email);
    await this.nextButton.click();

    // Wait for password page or 2FA page
    await this.page.waitForLoadState('networkidle');
  }

  async enterPassword(password: string) {
    await this.passwordInput.fill(password);
    await this.nextButton.click();

    // Wait for 2FA page or consent page
    await this.page.waitForLoadState('networkidle');
  }

  async enter2FACode(code: string) {
    await this.twoFactorInput.fill(code);
    await this.nextButton.click();

    // Wait for OAuth consent or redirect
    await this.page.waitForLoadState('networkidle');
  }

  async enterVerificationCode() {
    await this.verificationCodeLink.click();

    // Wait for OAuth consent or redirect
    await this.page.waitForLoadState('networkidle');
  }

  async allowOAuthPermissions() {
    if (await this.allowAccessButton.isVisible()) {
      await this.allowAccessButton.click();
    }

    // Wait for redirect back to GitHub
    await this.page.waitForURL('**/github.com/**', { timeout: 10000 });
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      await this.userAvatar.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getUserDisplayName(): Promise<string> {
    const userMenu = this.userAvatar.first();
    await userMenu.click();

    const userName =
      (await this.page
        .getByRole('heading', {
          name: 'User navigation',
        })
        .textContent()) || '';

    return userName.replace(/Account switcherClose$/, '').trim();
  }

  async logout() {
    const userMenu = this.page.locator('[data-testid="user-avatar"]');
    await userMenu.click();

    const logoutLink = this.page.getByRole('link', { name: 'Sign out' });
    await logoutLink.click();

    // Confirm logout
    const confirmLogout = this.page.getByRole('link', { name: 'Sign out' });
    if (await confirmLogout.isVisible()) {
      await confirmLogout.click();
    }

    await this.page.waitForURL('**/github.com/**');
  }

  async clickTryAnotherWay() {
    if (await this.tryAnotherWayButton.isVisible()) {
      await this.tryAnotherWayButton.click();
      await this.page.waitForLoadState('networkidle');
    }
  }
}
