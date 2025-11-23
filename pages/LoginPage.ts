import { BasePage } from './BasePage';
import { Page } from '@playwright/test';

export class LoginPage extends BasePage {
  // Sauce Demo specific selectors
  readonly usernameInput = '[data-test="username"]';
  readonly passwordInput = '[data-test="password"]';
  readonly loginButton = '[data-test="login-button"]';
  readonly errorMessage = '[data-test="error"]';
  readonly loginLogo = '.login_logo';

  constructor(page: Page) {
    super(page);
  }

  async navigateToLogin() {
    await this.goto('/');
    await this.waitForElement(this.loginLogo);
  }

  async login(username: string, password: string) {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  async getErrorMessage() {
    return await this.getText(this.errorMessage);
  }

  async isLoginPageDisplayed() {
    return await this.page.isVisible(this.loginLogo);
  }
}