import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.js',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:8080',
    browserName: 'firefox',
    launchOptions: process.env.PLAYWRIGHT_FIREFOX_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_FIREFOX_EXECUTABLE_PATH }
      : {},
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 1000 } } },
    { name: 'phone', use: { viewport: { width: 390, height: 844 } } },
  ],
  webServer: {
    command: 'npm start',
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.CI,
  },
});
