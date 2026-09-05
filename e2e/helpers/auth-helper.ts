import { Page } from '@playwright/test';
import { setupApiMocks } from './mock-api';

export async function loginAsAdminViaUi(page: Page, email = 'admin@meridians.com', password = 'admin123') {
  await setupApiMocks(page);
  await page.goto('/admin/login');
  await page.fill('input#email', email);
  await page.fill('input#password', password);
  await page.click('button[type="submit"]:has-text("SIGN IN")');
  await page.waitForURL('**/admin/dashboard', { timeout: 15000 });
}

export async function injectAdminSession(page: Page, token = 'mock_jwt_token_for_playwright_test') {
  await setupApiMocks(page);
  // Navigate to an origin first so localStorage is accessible
  await page.goto('/admin/login');
  await page.evaluate((jwtToken) => {
    localStorage.setItem('token', jwtToken);
  }, token);
}
