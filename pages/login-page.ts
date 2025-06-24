import { Page } from '@playwright/test';
import { BASE_URL, USERNAME, PASSWORD } from '../constants';

export class LoginPage {
  constructor(readonly page: Page) {}

  async goto() {
    await this.page.goto(BASE_URL);
  }

  async login(username = USERNAME.STANDARD, password = PASSWORD.VALID) {
    await this.goto();
    await this.page.getByPlaceholder('Username').fill(username);
    await this.page.getByPlaceholder('Password').fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }
}
