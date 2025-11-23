import { BasePage } from './BasePage';
import { Page } from '@playwright/test';

export class HomePage extends BasePage {
  // Sauce Demo inventory page selectors
  readonly inventoryContainer = '.inventory_container';
  readonly inventoryItems = '.inventory_item';
  readonly shoppingCartLink = '.shopping_cart_link';
  readonly menuButton = '#react-burger-menu-btn';
  readonly logoutLink = '#logout_sidebar_link';
  readonly sortDropdown = '[data-test="product_sort_container"]';
  readonly addToCartButtons = '[data-test*="add-to-cart"]';

  constructor(page: Page) {
    super(page);
  }

  async isInventoryPageDisplayed() {
    return await this.page.isVisible(this.inventoryContainer);
  }

  async getInventoryItems() {
    await this.waitForElement(this.inventoryItems);
    return await this.page.locator(this.inventoryItems).count();
  }

  async addItemToCart(itemName: string) {
    const addButton = `[data-test="add-to-cart-${itemName.toLowerCase().replace(/\s+/g, '-')}"]`;
    await this.click(addButton);
  }

  async getCartItemCount() {
    const cartBadge = '.shopping_cart_badge';
    if (await this.page.isVisible(cartBadge)) {
      return await this.getText(cartBadge);
    }
    return '0';
  }

  async openMenu() {
    await this.click(this.menuButton);
  }

  async logout() {
    await this.openMenu();
    await this.waitForElement(this.logoutLink);
    await this.click(this.logoutLink);
  }

  async sortProducts(sortOption: string) {
    await this.page.selectOption(this.sortDropdown, sortOption);
  }

  async goToCart() {
    await this.click(this.shoppingCartLink);
  }
}