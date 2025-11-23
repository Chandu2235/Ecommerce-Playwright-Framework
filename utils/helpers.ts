import { Page } from '@playwright/test';
import { config } from './config';

export class TestHelpers {
  static async waitForPageLoad(page: Page, timeout: number = 5000) {
    await page.waitForLoadState('networkidle', { timeout });
  }

  static async takeScreenshot(page: Page, name: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await page.screenshot({ 
      path: `screenshots/${name}-${timestamp}.png`,
      fullPage: true 
    });
  }

  static generateRandomEmail(): string {
    const timestamp = Date.now();
    return `test${timestamp}@example.com`;
  }

  static async clearAndFill(page: Page, selector: string, text: string) {
    await page.fill(selector, '');
    await page.fill(selector, text);
  }

  static async scrollToElement(page: Page, selector: string) {
    await page.locator(selector).scrollIntoViewIfNeeded();
  }

  static async waitForElementToBeVisible(page: Page, selector: string, timeout: number = 5000) {
    await page.waitForSelector(selector, { state: 'visible', timeout });
  }

  static async getTestUser(userType: keyof typeof config.users = 'standard') {
    return {
      username: config.users[userType],
      password: config.password
    };
  }
}

export { config };