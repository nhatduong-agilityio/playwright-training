import { Page } from '@playwright/test';
import { BASE_URL, USERS } from '../constants';

export class LoginPage {
  constructor(readonly page: Page) {}

  async goto() {
    await this.page.goto(BASE_URL);
  }

  async login(user = USERS.STANDARD) {
    await this.goto();
    await this.page.getByPlaceholder('Username').fill(user.username);
    await this.page.getByPlaceholder('Password').fill(user.password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }
}
