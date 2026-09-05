import { test, expect } from '../fixtures/test-fixtures';

test.describe('Admin Authentication & Route Protection E2E Tests', () => {
  test.beforeEach(async ({ adminLoginPage, apiMocks }) => {
    await adminLoginPage.load();
  });

  test('should render Admin Login page with input controls and branding', async ({ adminLoginPage }) => {
    await expect(adminLoginPage.adminTitle).toBeVisible();
    await expect(adminLoginPage.emailInput).toBeVisible();
    await expect(adminLoginPage.passwordInput).toBeVisible();
    await expect(adminLoginPage.signInBtn).toBeVisible();
  });

  test('should toggle password visibility when clicking eye icon', async ({ adminLoginPage }) => {
    await adminLoginPage.passwordInput.fill('secret123');
    await expect(adminLoginPage.passwordInput).toHaveAttribute('type', 'password');

    await adminLoginPage.togglePasswordVisibility();
    await expect(adminLoginPage.passwordInput).toHaveAttribute('type', 'text');

    await adminLoginPage.togglePasswordVisibility();
    await expect(adminLoginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('should show validation error on empty credentials', async ({ adminLoginPage }) => {
    await adminLoginPage.signInBtn.click();
    await adminLoginPage.expectToastMessage(/fill in all fields/i);
  });

  test('should show error message on invalid credentials', async ({ adminLoginPage }) => {
    await adminLoginPage.login('wrong@meridians.com', 'badpassword');
    await adminLoginPage.expectToastMessage(/Invalid email or password/i);
  });

  test('should log in successfully with valid credentials and redirect to dashboard', async ({ page, adminLoginPage }) => {
    await adminLoginPage.login('admin@meridians.com', 'admin123');
    await adminLoginPage.expectToastMessage(/Login successful/i);
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 15000 });
  });

  test('should redirect unauthenticated users away from protected admin routes', async ({ page }) => {
    // Clear any token
    await page.evaluate(() => localStorage.removeItem('token'));
    await page.goto('/admin/dashboard');
    await expect(page).toHaveURL(/\/admin\/login/, { timeout: 15000 });
  });
});
