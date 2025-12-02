interface PaymentFormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  score: number;
  suggestions: string[];
}

class PaymentValidator {
  static validateCardNumber(cardNumber: string): ValidationResult {
    const errors: string[] = [];
    const suggestions: string[] = [];
    const cleanNumber = cardNumber.replace(/\s/g, '');
    
    if (!cleanNumber) {
      errors.push('Card number is required');
    } else if (!/^\d{13,19}$/.test(cleanNumber)) {
      errors.push('Card number must be 13-19 digits');
      suggestions.push('Enter a valid card number with 13-19 digits');
    } else if (!this.luhnCheck(cleanNumber)) {
      errors.push('Invalid card number');
      suggestions.push('Check your card number for typos');
    }
    
    const score = errors.length === 0 ? 100 : 0;
    return { isValid: errors.length === 0, errors, score, suggestions };
  }

  static validateExpiryDate(expiryDate: string): ValidationResult {
    const errors: string[] = [];
    const suggestions: string[] = [];
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    
    if (!expiryDate) {
      errors.push('Expiry date is required');
    } else if (!regex.test(expiryDate)) {
      errors.push('Expiry date must be in MM/YY format');
      suggestions.push('Use format MM/YY (e.g., 12/25)');
    } else {
      const [month, year] = expiryDate.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      
      if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        errors.push('Card has expired');
        suggestions.push('Use a card with a future expiry date');
      }
    }
    
    const score = errors.length === 0 ? 100 : 0;
    return { isValid: errors.length === 0, errors, score, suggestions };
  }

  static validateCVV(cvv: string): ValidationResult {
    const errors: string[] = [];
    const suggestions: string[] = [];
    
    if (!cvv) {
      errors.push('CVV is required');
    } else if (!/^\d{3,4}$/.test(cvv)) {
      errors.push('CVV must be 3 or 4 digits');
      suggestions.push('Find the 3-4 digit security code on the back of your card');
    }
    
    const score = errors.length === 0 ? 100 : 0;
    return { isValid: errors.length === 0, errors, score, suggestions };
  }

  static validateCardholderName(name: string): ValidationResult {
    const errors: string[] = [];
    const suggestions: string[] = [];
    
    if (!name.trim()) {
      errors.push('Cardholder name is required');
    } else if (name.trim().length < 2) {
      errors.push('Cardholder name must be at least 2 characters');
      suggestions.push('Enter the full name as shown on the card');
    } else if (!/^[a-zA-Z\s]+$/.test(name)) {
      errors.push('Cardholder name can only contain letters and spaces');
      suggestions.push('Remove numbers and special characters');
    }
    
    const score = errors.length === 0 ? 100 : 0;
    return { isValid: errors.length === 0, errors, score, suggestions };
  }

  static validateBillingAddress(address: PaymentFormData['billingAddress']): ValidationResult {
    const errors: string[] = [];
    const suggestions: string[] = [];
    
    if (!address.street.trim()) errors.push('Street address is required');
    if (!address.city.trim()) errors.push('City is required');
    if (!address.state.trim()) errors.push('State is required');
    if (!address.zipCode.trim()) errors.push('ZIP code is required');
    if (!address.country.trim()) errors.push('Country is required');
    
    if (address.zipCode && !/^\d{5}(-\d{4})?$/.test(address.zipCode)) {
      errors.push('Invalid ZIP code format');
      suggestions.push('Use 5-digit ZIP code format (e.g., 12345 or 12345-6789)');
    }
    
    const score = errors.length === 0 ? 100 : 0;
    return { isValid: errors.length === 0, errors, score, suggestions };
  }

  private static luhnCheck(cardNumber: string): boolean {
    let sum = 0;
    let isEven = false;
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber[i]);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  }
}

class PaymentIntegration {
  private formData: PaymentFormData;
  private validationErrors: Map<string, string[]> = new Map();

  constructor() {
    this.formData = {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: '',
      billingAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      }
    };
  }

  validateField(fieldName: keyof PaymentFormData, value: any): ValidationResult {
    let result: ValidationResult;
    
    switch (fieldName) {
      case 'cardNumber':
        result = PaymentValidator.validateCardNumber(value);
        break;
      case 'expiryDate':
        result = PaymentValidator.validateExpiryDate(value);
        break;
      case 'cvv':
        result = PaymentValidator.validateCVV(value);
        break;
      case 'cardholderName':
        result = PaymentValidator.validateCardholderName(value);
        break;
      case 'billingAddress':
        result = PaymentValidator.validateBillingAddress(value);
        break;
      default:
        result = { isValid: true, errors: [], score: 100, suggestions: [] };
    }
    
    if (result.isValid) {
      this.validationErrors.delete(fieldName);
    } else {
      this.validationErrors.set(fieldName, result.errors);
    }
    
    return result;
  }

  validateAllFields(): boolean {
    const cardNumberResult = this.validateField('cardNumber', this.formData.cardNumber);
    const expiryResult = this.validateField('expiryDate', this.formData.expiryDate);
    const cvvResult = this.validateField('cvv', this.formData.cvv);
    const nameResult = this.validateField('cardholderName', this.formData.cardholderName);
    const addressResult = this.validateField('billingAddress', this.formData.billingAddress);
    
    return cardNumberResult.isValid && 
           expiryResult.isValid && 
           cvvResult.isValid && 
           nameResult.isValid && 
           addressResult.isValid;
  }

  updateField(fieldName: keyof PaymentFormData, value: any): void {
    if (fieldName === 'billingAddress') {
      this.formData.billingAddress = { ...this.formData.billingAddress, ...value };
    } else {
      (this.formData as any)[fieldName] = value;
    }
    
    this.validateField(fieldName, fieldName === 'billingAddress' ? this.formData.billingAddress : value);
  }

  getValidationErrors(): Map<string, string[]> {
    return this.validationErrors;
  }

  hasErrors(): boolean {
    return this.validationErrors.size > 0;
  }

  async processPayment(): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    if (!this.validateAllFields()) {
      return { success: false, error: 'Please fix validation errors before proceeding' };
    }
    
    try {
      // Simulate payment processing
      const response = await this.submitPayment(this.formData);
      return { success: true, transactionId: response.transactionId };
    } catch (error) {
      return { success: false, error: 'Payment processing failed' };
    }
  }

  private async submitPayment(paymentData: PaymentFormData): Promise<{ transactionId: string }> {
    // Mock payment gateway integration
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) { // 90% success rate
          resolve({ transactionId: `txn_${Date.now()}` });
        } else {
          reject(new Error('Payment declined'));
        }
      }, 2000);
    });
  }
}

// Usage example with DOM element integration
class PaymentFormHandler {
  private paymentIntegration: PaymentIntegration;
  private formElement: HTMLFormElement;

  constructor(formSelector: string) {
    this.paymentIntegration = new PaymentIntegration();
    this.formElement = document.querySelector(formSelector) as HTMLFormElement;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    const inputs = this.formElement.querySelectorAll('input, select');
    
    inputs.forEach(input => {
      input.addEventListener('blur', (e) => {
        const target = e.target as HTMLInputElement;
        this.handleFieldValidation(target);
      });
      
      input.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        this.clearFieldErrors(target);
      });
    });
    
    this.formElement.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });
  }

  private handleFieldValidation(input: HTMLInputElement): void {
    const fieldName = input.name as keyof PaymentFormData;
    const value = input.value;
    
    if (fieldName.startsWith('billing')) {
      const addressField = fieldName.replace('billing', '').toLowerCase();
      const addressValue = { [addressField]: value };
      this.paymentIntegration.updateField('billingAddress', addressValue);
    } else {
      this.paymentIntegration.updateField(fieldName, value);
    }
    
    this.displayFieldErrors(input, fieldName);
  }

  private displayFieldErrors(input: HTMLInputElement, fieldName: string): void {
    const errorContainer = input.parentElement?.querySelector('.error-message');
    const errors = this.paymentIntegration.getValidationErrors().get(fieldName);
    
    if (errorContainer) {
      if (errors && errors.length > 0) {
        errorContainer.textContent = errors[0];
        errorContainer.classList.add('visible');
        input.classList.add('error');
      } else {
        errorContainer.textContent = '';
        errorContainer.classList.remove('visible');
        input.classList.remove('error');
      }
    }
  }

  private clearFieldErrors(input: HTMLInputElement): void {
    const errorContainer = input.parentElement?.querySelector('.error-message');
    if (errorContainer) {
      errorContainer.classList.remove('visible');
      input.classList.remove('error');
    }
  }

  private async handleFormSubmit(): Promise<void> {
    const submitButton = this.formElement.querySelector('button[type="submit"]') as HTMLButtonElement;
    
    submitButton.disabled = true;
    submitButton.textContent = 'Processing...';
    
    try {
      const result = await this.paymentIntegration.processPayment();
      
      if (result.success) {
        this.showSuccessMessage(`Payment successful! Transaction ID: ${result.transactionId}`);
      } else {
        this.showErrorMessage(result.error || 'Payment failed');
      }
    } catch (error) {
      this.showErrorMessage('An unexpected error occurred');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Pay Now';
    }
  }

  private showSuccessMessage(message: string): void {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.textContent = message;
    this.formElement.prepend(messageDiv);
  }

  private showErrorMessage(message: string): void {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'error-message';
    messageDiv.textContent = message;
    this.formElement.prepend(messageDiv);
  }
}
