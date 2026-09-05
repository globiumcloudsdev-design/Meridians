import { test, expect } from '../fixtures/test-fixtures';

test.describe('Admin Dashboard & Management Console E2E Tests', () => {
  test.beforeEach(async ({ adminLoginPage, page }) => {
    await adminLoginPage.load();
    await adminLoginPage.login('admin@meridians.com', 'admin123');
    await page.waitForURL('**/admin/dashboard', { timeout: 15000 });
  });

  test('should render admin dashboard overview and metrics cards', async ({ adminDashboardPage, page }) => {
    await expect(adminDashboardPage.dashboardHeading).toBeVisible();
    await expect(adminDashboardPage.blogCard).toBeVisible();
    await expect(adminDashboardPage.subscribersCard).toBeVisible();
    await expect(adminDashboardPage.contactCard).toBeVisible();
    await expect(adminDashboardPage.admissionCard).toBeVisible();
  });

  test('should display admin sidebar navigation links', async ({ adminDashboardPage, isMobile }) => {
    test.skip(isMobile, 'Sidebar is collapsed/in drawer on mobile');
    await expect(adminDashboardPage.getSidebarLink('Dashboard')).toBeVisible();
    await expect(adminDashboardPage.getSidebarLink('Blog Posts')).toBeVisible();
    await expect(adminDashboardPage.getSidebarLink('Contact Messages')).toBeVisible();
    await expect(adminDashboardPage.getSidebarLink('Admission Queries')).toBeVisible();
    await expect(adminDashboardPage.getSidebarLink('Subscribers')).toBeVisible();
    await expect(adminDashboardPage.getSidebarLink('Classes')).toBeVisible();
  });

  test('should toggle sidebar collapsed state', async ({ adminDashboardPage, isMobile }) => {
    test.skip(isMobile, 'Desktop sidebar toggle only');
    if (await adminDashboardPage.sidebarCollapseBtn.isVisible()) {
      await adminDashboardPage.sidebarCollapseBtn.click();
      // Click again to expand back
      await adminDashboardPage.sidebarCollapseBtn.click();
      await expect(adminDashboardPage.dashboardHeading).toBeVisible();
    }
  });

  test('should navigate between admin management sections via sidebar', async ({ adminDashboardPage, page, isMobile }) => {
    test.skip(isMobile, 'Desktop navigation');
    await adminDashboardPage.getSidebarLink('Admission Queries').click();
    await expect(page).toHaveURL(/\/admin\/admission-queries/);

    await adminDashboardPage.getSidebarLink('Subscribers').click();
    await expect(page).toHaveURL(/\/admin\/subscribers/);
  });

  test('should log out admin and redirect to admin login page', async ({ adminDashboardPage, page }) => {
    await adminDashboardPage.logout();
    await expect(page).toHaveURL(/\/admin\/login/, { timeout: 15000 });
  });
});
