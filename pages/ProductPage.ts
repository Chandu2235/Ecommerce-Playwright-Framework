import { BasePage } from './BasePage';
import { Page } from '@playwright/test';

export class ProductPage extends BasePage {
  // Sauce Demo product detail page selectors
  readonly productName = '.inventory_details_name';
  readonly productDescription = '.inventory_details_desc';
  readonly productPrice = '.inventory_details_price';
  readonly addToCartButton = '[data-test*="add-to-cart"]';
  readonly removeButton = '[data-test*="remove"]';
  readonly backButton = '[data-test="back-to-products"]';
  readonly productImage = '.inventory_details_img';

  constructor(page: Page) {
    super(page);
  }

  async getProductName() {
    return await this.getText(this.productName);
  }

  async getProductDescription() {
    return await this.getText(this.productDescription);
  }

  async getProductPrice() {
    const priceText = await this.getText(this.productPrice);
    return parseFloat(priceText.replace('$', ''));
  }

  async addToCart() {
    await this.click(this.addToCartButton);
  }

  async removeFromCart() {
    await this.click(this.removeButton);
  }

  async goBackToProducts() {
    await this.click(this.backButton);
  }

  async isProductImageDisplayed() {
    return await this.page.isVisible(this.productImage);
  }
}