const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  timeout: 50000,
  expect: { timeout: 5000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  use: {
    baseURL: 'http://localhost:5000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } }
  ],
  webServer: {
    command: 'npm run start',
    port: 3000,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
  outputDir: 'test-results/'
});




// module.exports = defineConfig({
//   testDir: './tests',
//   timeout: 30000,
//   expect: { timeout: 5000 },
//   fullyParallel: true,
//   forbidOnly: !!process.env.CI,
//   retries: process.env.CI ? 2 : 0,
//   workers: process.env.CI ? 1 : undefined,
//   reporter: [
//     ['html', { outputFolder: 'playwright-report' }],
//     ['json', { outputFile: 'test-results/playwright-results.json' }],
//     ['junit', { outputFile: 'test-results/playwright-results.xml' }]
//   ],
//   use: {
//     baseURL: 'http://localhost:5000',
//     trace: 'on-first-retry',
//     screenshot: 'only-on-failure',
//     video: 'retain-on-failure',
//     actionTimeout: 10000,
//     navigationTimeout: 30000
//   },
//   projects: [
//     { 
//       name: 'chromium', 
//       use: { ...devices['Desktop Chrome'] } 
//     },
//     { 
//       name: 'firefox', 
//       use: { ...devices['Desktop Firefox'] } 
//     },
//     { 
//       name: 'webkit', 
//       use: { ...devices['Desktop Safari'] } 
//     }
//   ],
//   webServer: {
//     command: 'npm run start',
//     port: 3000,
//     timeout: 120 * 1000,
//     reuseExistingServer: !process.env.CI,
//   },
//   outputDir: 'test-results/',
//   globalSetup: require.resolve('./tests/global-setup.js'),
//   globalTeardown: require.resolve('./tests/global-teardown.js')
// });