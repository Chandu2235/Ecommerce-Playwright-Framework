import { test, expect } from '@playwright/test';
import { config } from '../../utils/config';

test.describe('API Health Tests', () => {
  test('should verify Sauce Demo site is accessible', async ({ request }) => {
    const response = await request.get(config.baseUrl);
    expect(response.status()).toBe(200);
    
    const body = await response.text();
    expect(body).toContain('Swag Labs');
  });

  test('should handle invalid endpoints gracefully', async ({ request }) => {
    const response = await request.get(`${config.baseUrl}/invalid-endpoint`);
    expect(response.status()).toBe(404);
  });
});