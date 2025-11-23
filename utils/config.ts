export const config = {
  baseUrl: process.env.BASE_URL || 'https://www.saucedemo.com/',
  apiUrl: process.env.API_URL || '',
  testUser: {
    email: process.env.TEST_USER_EMAIL || 'standard_user',
    password: process.env.TEST_USER_PASSWORD || 'secret_sauce'
  },
  headless: process.env.HEADLESS === 'true',
  
  // Sauce Demo specific users
  users: {
    standard: 'standard_user',
    locked: 'locked_out_user',
    problem: 'problem_user',
    performance: 'performance_glitch_user',
    error: 'error_user',
    visual: 'visual_user'
  },
  
  // Common password for all Sauce Demo users
  password: 'secret_sauce'
};