import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { HomePage } from '../../pages/HomePage';
import { config } from '../../utils/config';

test.describe('Navigation Tests', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    
    await loginPage.navigateToLogin();
    await loginPage.login(config.users.standard, config.password);
  });

  test('should navigate to cart page', async ({ page }) => {
    await homePage.goToCart();
    await expect(page).toHaveURL(/.*cart.html/);
  });

  test('should logout successfully', async ({ page }) => {
    await homePage.logout();
    
    // Should be back to login page
    expect(await loginPage.isLoginPageDisplayed()).toBeTruthy();
    await expect(page).toHaveURL(config.baseUrl);
  });

  test('should display correct number of inventory items', async ({ page }) => {
    const itemCount = await homePage.getInventoryItems();
    expect(itemCount).toBeGreaterThan(0);
    expect(itemCount).toBe(6); // Sauce Demo has 6 products
  });
});