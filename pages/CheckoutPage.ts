import { BasePage } from './BasePage';
import { Page } from '@playwright/test';

export class CheckoutPage extends BasePage {
  // Sauce Demo checkout page selectors
  readonly firstNameInput = '[data-test="firstName"]';
  readonly lastNameInput = '[data-test="lastName"]';
  readonly postalCodeInput = '[data-test="postalCode"]';
  readonly continueButton = '[data-test="continue"]';
  readonly finishButton = '[data-test="finish"]';
  readonly cancelButton = '[data-test="cancel"]';
  readonly errorMessage = '[data-test="error"]';
  readonly completeHeader = '.complete-header';
  readonly summaryTotal = '.summary_total_label';

  constructor(page: Page) {
    super(page);
  }

  async fillCheckoutInformation(firstName: string, lastName: string, postalCode: string) {
    await this.fill(this.firstNameInput, firstName);
    await this.fill(this.lastNameInput, lastName);
    await this.fill(this.postalCodeInput, postalCode);
  }

  async continueToOverview() {
    await this.click(this.continueButton);
  }

  async finishOrder() {
    await this.click(this.finishButton);
  }

  async cancelCheckout() {
    await this.click(this.cancelButton);
  }

  async getErrorMessage() {
    return await this.getText(this.errorMessage);
  }

  async isOrderComplete() {
    return await this.page.isVisible(this.completeHeader);
  }

  async getTotalAmount() {
    const totalText = await this.getText(this.summaryTotal);
    return parseFloat(totalText.replace(/[^0-9.]/g, ''));
  }
}