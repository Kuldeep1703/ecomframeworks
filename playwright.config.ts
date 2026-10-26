import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import { STORAGE_STATE } from './utils/constants';

// Load values from the .env file into process.env
dotenv.config();

export default defineConfig({
  testDir: './tests',

  // Run test files in parallel
  fullyParallel: true,
  // Fail the CI build if someone leaves test.only in the code
  forbidOnly: !!process.env.CI,
  // Retry flaky tests only on CI
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,

  timeout: 30_000,
  expect: { timeout: 5_000 },

  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
    // SauceDemo uses data-test="..." instead of data-testid,
    // so getByTestId('username') will find [data-test="username"]
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
  },

  projects: [
    // 1) Logs in once and saves the session to .auth/standard-user.json
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },

    // 2) Real tests. They reuse the saved login, so no need to log in every time.
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: STORAGE_STATE },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], storageState: STORAGE_STATE },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], storageState: STORAGE_STATE },
      dependencies: ['setup'],
    },
  ],
});
