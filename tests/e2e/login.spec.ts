import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { HomePage } from '../../pages/HomePage';
import { config } from '../../utils/config';

test.describe('Login Tests', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    await loginPage.navigateToLogin();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    const user = await config.users.standard;
    
    await loginPage.login(user, config.password);
    
    // Verify successful login by checking inventory page
    await expect(page).toHaveURL(/.*inventory.html/);
    expect(await homePage.isInventoryPageDisplayed()).toBeTruthy();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await loginPage.login('invalid_user', 'invalid_password');
    
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Username and password do not match');
  });

  test('should show error for locked out user', async ({ page }) => {
    await loginPage.login(config.users.locked, config.password);
    
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('locked out');
  });

  test('should show error for empty credentials', async ({ page }) => {
    await loginPage.login('', '');
    
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Username is required');
  });
});