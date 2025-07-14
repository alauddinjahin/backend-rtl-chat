const { BASE_PATH } = require('@/config/api');
const { test, expect } = require('@playwright/test');

test.describe('App E2E Tests', () => {

  test('should load homepage', async ({ request }) => {
    const response = await request.get('/');
    expect(response.status()).toBe(200);
  });

  test('should load Welcome page with docs link', async ({ request }) => {
    const response = await request.get(BASE_PATH);
    expect(response.status()).toBe(200);
    
    // Get the HTML content
    const html = await response.text();
    
    // Verify the welcome message exists
    expect(html).toContain('<h1>'); 
    expect(html).toContain('Welcome'); 
    
    // Verify the docs link exists with correct href
    expect(html).toContain('<a ');
    // expect(html).toContain('href="/api/v1/docs"');
    expect(html).toMatch(/href=".*\/api\/v1\/docs"/);
    expect(html).toContain('API Documentation');
  });

  // More comprehensive version using Playwright's page model
  test('should render Welcome page correctly (UI verification)', async ({ page }) => {
    await page.goto(`${BASE_PATH}`);
    
    // Verify h1 welcome message
    const heading = await page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText(/Welcome/i);
    
    // Verify docs link
    const docsLink = await page.locator('a[href="http://localhost:5000/api/v1/docs"]');
    await expect(docsLink).toBeVisible();
    await expect(docsLink).toHaveText(/API Documentation/i);    
    // wait for new page to load

      // Now assert the URL of the new page

      // const [newPage] = await Promise.all([
      //   page.context().waitForEvent('page'),
      //   docsLink.click(),
      // ]);
      // await expect(newPage).toHaveURL(/\/api\/v1\/docs\/?$/);

  });
});




/* 
const { test, expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');

// Test user data
const testUser = {
  email: `testuser_${Date.now()}@example.com`,
  password: 'Test@1234',
  name: 'Test User'
};

test.describe.configure({ mode: 'serial' });

test.describe('Application UI Flows', () => {
  
  let page;
  let authToken;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('/');
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('should load homepage', async () => {
    await expect(page).toHaveTitle(/Your App Name/);
    await expect(page.locator('nav')).toBeVisible();
  });

  test('should complete user registration flow', async () => {
    // Navigate to registration
    await page.click('text=Sign Up');
    await expect(page).toHaveURL(/\/register$/);

    // Fill registration form
    await page.fill('input[name="name"]', testUser.name);
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.fill('input[name="confirmPassword"]', testUser.password);
    await page.click('button[type="submit"]');

    // Verify successful registration
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.locator('.welcome-message')).toContainText(testUser.name);
  });

  test('should handle user login flow', async () => {
    // Logout first
    await page.click('text=Logout');
    await expect(page).toHaveURL('/');

    // Navigate to login
    await page.click('text=Login');
    await expect(page).toHaveURL(/\/login$/);

    // Fill login form
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]');

    // Verify successful login
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.locator('.welcome-message')).toContainText(testUser.name);
  });

  test('should send and display messages', async () => {
    const testMessage = faker.lorem.sentence();
    
    // Navigate to messages
    await page.click('text=Messages');
    await expect(page).toHaveURL(/\/messages$/);

    // Send message
    await page.fill('textarea[name="message"]', testMessage);
    await page.click('button[type="submit"]');

    // Verify message appears
    await expect(page.locator('.message-list')).toContainText(testMessage);
  });

  test('should display 404 for unknown routes', async () => {
    await page.goto('/nonexistent-route');
    await expect(page.locator('.error-page')).toContainText('404');
  });
});

*/