import { BasePage } from './BasePage';
import { Page } from '@playwright/test';

export class ProductPage extends BasePage {
  readonly productTitle = 'h1[data-testid="product-title"]';
  readonly addToCartButton = 'button[data-testid="add-to-cart"]';
  readonly quantityInput = 'input[data-testid="quantity"]';
  readonly price = '[data-testid="product-price"]';

  constructor(page: Page) {
    super(page);
  }

  async viewProduct(productId: string) {
    await this.goto(`/product/${productId}`);
  }

  async getProductTitle() {
    return await this.getText(this.productTitle);
  }

  async getPrice() {
    return await this.getText(this.price);
  }

  async addToCart(quantity: number = 1) {
    if (quantity > 1) {
      await this.fill(this.quantityInput, quantity.toString());
    }
    await this.click(this.addToCartButton);
  }
}