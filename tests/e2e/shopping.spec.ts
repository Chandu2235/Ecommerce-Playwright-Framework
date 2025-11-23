import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { HomePage } from '../../pages/HomePage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { config } from '../../utils/config';

test.describe('Shopping Flow Tests', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    
    // Login before each test
    await loginPage.navigateToLogin();
    await loginPage.login(config.users.standard, config.password);
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('should add items to cart and complete purchase', async ({ page }) => {
    // Add items to cart
    await homePage.addItemToCart('sauce-labs-backpack');
    await homePage.addItemToCart('sauce-labs-bike-light');
    
    // Verify cart count
    const cartCount = await homePage.getCartItemCount();
    expect(cartCount).toBe('2');
    
    // Go to cart
    await homePage.goToCart();
    expect(await cartPage.getCartItemsCount()).toBe(2);
    
    // Proceed to checkout
    await cartPage.proceedToCheckout();
    
    // Fill checkout information
    await checkoutPage.fillCheckoutInformation('John', 'Doe', '12345');
    await checkoutPage.continueToOverview();
    
    // Complete order
    await checkoutPage.finishOrder();
    
    // Verify order completion
    expect(await checkoutPage.isOrderComplete()).toBeTruthy();
  });

  test('should remove items from cart', async ({ page }) => {
    // Add item to cart
    await homePage.addItemToCart('sauce-labs-backpack');
    await homePage.goToCart();
    
    // Verify item is in cart
    expect(await cartPage.getCartItemsCount()).toBe(1);
    
    // Remove item
    await cartPage.removeItem('sauce-labs-backpack');
    
    // Verify cart is empty
    expect(await cartPage.getCartItemsCount()).toBe(0);
  });

  test('should sort products correctly', async ({ page }) => {
    // Test sorting by price (low to high)
    await homePage.sortProducts('lohi');
    
    // Verify inventory is still displayed
    expect(await homePage.isInventoryPageDisplayed()).toBeTruthy();
    
    // Test sorting by name (Z to A)
    await homePage.sortProducts('za');
    expect(await homePage.isInventoryPageDisplayed()).toBeTruthy();
  });
});