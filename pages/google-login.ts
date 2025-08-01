import { Page, Locator, expect } from '@playwright/test';

export class GoogleLoginPage {
  readonly page: Page;
  readonly nextButton: Locator;
  readonly userAvatar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nextButton = page.getByRole('button', { name: 'Next' });
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
    await this.page
      .getByRole('button', {
        name: 'Continue with Google',
      })
      .click();
    // Wait for redirect to Google OAuth
    await this.page.waitForURL('**/accounts.google.com/**');
  }

  async enterEmail(email: string) {
    await this.page
      .getByRole('textbox', { name: 'Email or phone' })
      .fill(email);
    await this.nextButton.click();

    // Wait for password page or 2FA page
    await this.page.waitForLoadState('networkidle');
  }

  async enterPassword(password: string) {
    await this.page
      .getByRole('textbox', {
        name: 'Enter your password',
      })
      .fill(password);
    await this.nextButton.click();
  }

  async enter2FACode(code: string) {
    await this.page.getByRole('textbox', { name: 'Enter code' }).fill(code);
    await this.nextButton.click();
  }

  async selectVerificationCode() {
    await this.page
      .getByRole('link', {
        name: 'Get a verification code from',
      })
      .click();
  }

  async allowOAuthPermissions() {
    const allowButton = await this.page.getByRole('button', {
      name: 'Continue',
    });

    if (await allowButton.isVisible()) {
      await allowButton.click();
    }

    // Wait for redirect back to GitHub
    await this.page.waitForURL('**/github.com/**', { timeout: 10000 });
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      await this.userAvatar.waitFor({ state: 'visible' });
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
    const tryAnotherWayButton = await this.page.getByRole('button', {
      name: 'Try another way',
    });

    if (await tryAnotherWayButton.isVisible()) {
      await tryAnotherWayButton.click();
    }
  }
}
