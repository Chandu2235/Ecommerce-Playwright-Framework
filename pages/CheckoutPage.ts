import { BasePage } from './BasePage';
import { Page } from '@playwright/test';

export class CheckoutPage extends BasePage {
  readonly firstNameInput = 'input[name="firstName"]';
  readonly lastNameInput = 'input[name="lastName"]';
  readonly emailInput = 'input[name="email"]';
  readonly addressInput = 'input[name="address"]';
  readonly completeOrderButton = 'button[data-testid="complete-order"]';
  readonly successMessage = '.success-message';

  constructor(page: Page) {
    super(page);
  }

  async fillShippingDetails(firstName: string, lastName: string, email: string, address: string) {
    await this.fill(this.firstNameInput, firstName);
    await this.fill(this.lastNameInput, lastName);
    await this.fill(this.emailInput, email);
    await this.fill(this.addressInput, address);
  }

  async completeOrder() {
    await this.click(this.completeOrderButton);
  }

  async getSuccessMessage() {
    return await this.getText(this.successMessage);
  }
}