import { BasePage } from './BasePage';
import { Page } from '@playwright/test';

export class CartPage extends BasePage {
  // Sauce Demo cart page selectors
  readonly cartItems = '.cart_item';
  readonly checkoutButton = '[data-test="checkout"]';
  readonly continueShoppingButton = '[data-test="continue-shopping"]';
  readonly removeButtons = '[data-test*="remove"]';
  readonly cartQuantity = '.cart_quantity';
  readonly itemName = '.inventory_item_name';
  readonly itemPrice = '.inventory_item_price';

  constructor(page: Page) {
    super(page);
  }

  async getCartItemsCount() {
    return await this.page.locator(this.cartItems).count();
  }

  async removeItem(itemName: string) {
    const removeButton = `[data-test="remove-${itemName.toLowerCase().replace(/\s+/g, '-')}"]`;
    await this.click(removeButton);
  }

  async proceedToCheckout() {
    await this.click(this.checkoutButton);
  }

  async continueShopping() {
    await this.click(this.continueShoppingButton);
  }

  async getItemNames() {
    return await this.page.locator(this.itemName).allTextContents();
  }

  async getTotalPrice() {
    const prices = await this.page.locator(this.itemPrice).allTextContents();
    return prices.reduce((total, price) => {
      return total + parseFloat(price.replace('$', ''));
    }, 0);
  }
}