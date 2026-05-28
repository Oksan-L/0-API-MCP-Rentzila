import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
    baseURL: process.env.BASE_URL ?? 'https://dev.rentzila.com.ua',
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
    },
  },

  projects: [

    {
      name: 'api',
      testMatch: 'tests/**/*.spec.ts',
    },

    // it is not necessary to run tests in browsers for API testing
    // {
    //   name: 'chromium',
    //   use: { ...devices['Desktop Chrome'] },
    // },

  ],

});
