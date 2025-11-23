import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ProductPage } from '../../pages/ProductPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

test.describe('Ecommerce Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Setup before each test
    await page.goto('/');
  });

  test('Complete purchase from product to checkout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Login
    await page.goto('/login');
    await loginPage.login('user@example.com', 'password123');
    await expect(page).toHaveURL('/dashboard');

    // Browse and add product
    await productPage.viewProduct('12345');
    const productTitle = await productPage.getProductTitle();
    expect(productTitle).toContain('Product Name');
    
    await productPage.addToCart(2);
    await expect(page).toHaveURL('/cart');

    // Review cart
    const cartTotal = await cartPage.getCartTotal();
    expect(cartTotal).toBeGreaterThan(0);

    // Proceed to checkout
    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingDetails(
      'John',
      'Doe',
      'john@example.com',
      '123 Main St'
    );

    // Complete order
    await checkoutPage.completeOrder();
    const successMsg = await checkoutPage.getSuccessMessage();
    expect(successMsg).toContain('Order Confirmed');
  });

  test('Handle out of stock product', async ({ page }) => {
    const productPage = new ProductPage(page);
    await productPage.viewProduct('out-of-stock-id');
    
    const addButton = page.locator('[data-testid="add-to-cart"]');
    await expect(addButton).toBeDisabled();
  });
});