<img width="1918" height="1016" alt="image" src="https://github.com/user-attachments/assets/66d357da-b80f-4c44-b56a-e45b8c9bbc64" />
<img width="1597" height="751" alt="image" src="https://github.com/user-attachments/assets/163a3ecf-a74f-4562-b315-e4eda67ea6fe" />


# Sauce Demo Test Automation Framework

This is a Playwright-based test automation framework for testing the Sauce Demo e-commerce application.
https://www.saucedemo.com/

## Setup

1. Install dependencies:
```bash
npm install
npx playwright install
```

2. Configure environment variables in `.env`:
```
BASE_URL=https://www.saucedemo.com/
TEST_USER_EMAIL=standard_user
TEST_USER_PASSWORD=secret_sauce
HEADLESS=false
```

## Available Test Users

The framework supports all Sauce Demo users:
- `standard_user` - Standard user with no issues
- `locked_out_user` - User that gets locked out
- `problem_user` - User with various issues
- `performance_glitch_user` - User with performance issues
- `error_user` - User that encounters errors
- `visual_user` - User for visual testing

All users use the password: `secret_sauce`

## Running Tests

### All Tests
```bash
npm test
```

### Specific Test Suites
```bash
npm run test:ui      # UI tests only
npm run test:e2e     # End-to-end tests only
npm run test:api     # API tests only
```

### Browser-Specific Tests
```bash
npm run test:chrome   # Chrome only
npm run test:firefox  # Firefox only
npm run test:webkit   # Safari/WebKit only
npm run test:mobile   # Mobile Chrome
```

### Debug Mode
```bash
npm run test:debug    # Run with Playwright inspector
npm run test:headed   # Run with browser UI visible
```

### CI/CD
```bash
npm run test:ci       # Run tests with JUnit reporter for CI
```

## Test Reports

View test reports:
```bash
npm run test:report
```

## Project Structure

```
├── pages/              # Page Object Models
│   ├── BasePage.ts     # Base page with common methods
│   ├── LoginPage.ts    # Login page interactions
│   ├── HomePage.ts     # Inventory/home page interactions
│   ├── CartPage.ts     # Shopping cart interactions
│   ├── CheckoutPage.ts # Checkout process interactions
│   └── ProductPage.ts  # Product detail page interactions
├── tests/
│   ├── api/           # API tests
│   ├── e2e/           # End-to-end tests
│   └── ui/            # UI component tests
├── utils/
│   ├── config.ts      # Configuration and test data
│   └── helpers.ts     # Test utilities and helpers
├── fixtures/          # Test fixtures and setup
└── .env              # Environment variables
```

## Jenkins CI/CD

The framework includes a `Jenkinsfile` for CI/CD pipeline with:
- Node.js setup
- Dependency installation
- Parallel test execution
- Test reporting
- Artifact archiving

### Jenkins Requirements
- NodeJS plugin
- HTML Publisher plugin
- JUnit plugin

## Page Object Pattern

The framework uses the Page Object Model pattern for maintainable tests:

```typescript
// Example usage
const loginPage = new LoginPage(page);
await loginPage.navigateToLogin();
await loginPage.login('standard_user', 'secret_sauce');
```

## Configuration

All configuration is centralized in `utils/config.ts` and can be overridden via environment variables.

## Best Practices

1. Use data-test attributes for reliable element selection
2. Implement proper waits and error handling
3. Keep tests independent and atomic
4. Use meaningful test descriptions
5. Implement proper cleanup in test hooks
