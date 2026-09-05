import { test, expect } from '../fixtures/test-fixtures';

test.describe('Global Navigation & Header/Footer E2E Tests', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.load();
  });

  test('should render navbar with brand logo and Meridian\'s text', async ({ navPage, isMobile }) => {
    await expect(navPage.navElement).toBeVisible();
    await expect(navPage.logoLink).toBeVisible();
    if (!isMobile) {
      await expect(navPage.brandName).toBeVisible();
    }
  });

  test('should navigate to key public pages via desktop navbar', async ({ page, navPage, isMobile }) => {
    test.skip(isMobile, 'Desktop navigation menu only');

    // Home
    await navPage.getNavLink('Home').click();
    await expect(page).toHaveURL(/\/$/);

    // About Us
    await navPage.getNavLink('About Us').click();
    await expect(page).toHaveURL(/\/about$/);

    // Course Details
    await navPage.getNavLink('Course Details').click();
    await expect(page).toHaveURL(/\/programs$/);

    // Admissions
    await navPage.getNavLink('Admissions').click();
    await expect(page).toHaveURL(/\/admissions$/);

    // Online Quran
    await navPage.getNavLink('Online Quran').click();
    await expect(page).toHaveURL(/\/online-quran$/);

    // Blog
    await navPage.getNavLink('Blog').click();
    await expect(page).toHaveURL(/\/blog$/);
  });

  test('should open and navigate through Resources dropdown menu', async ({ page, navPage, isMobile }) => {
    test.skip(isMobile, 'Desktop dropdown only');

    await navPage.openResourcesDropdown();

    // Library link
    const libraryLink = page.locator('nav a[href="/library"]').first();
    await expect(libraryLink).toBeVisible();
    await libraryLink.click();
    await expect(page).toHaveURL(/\/library$/);

    // Navigate back and test Notes
    await page.goto('/');
    await navPage.openResourcesDropdown();
    const notesLink = page.locator('nav a[href="/notes"]').first();
    await expect(notesLink).toBeVisible();
    await notesLink.click();
    await expect(page).toHaveURL(/\/notes$/);

    // Navigate back and test Video
    await page.goto('/');
    await navPage.openResourcesDropdown();
    const videoLink = page.locator('nav a[href="/video"]').first();
    await expect(videoLink).toBeVisible();
    await videoLink.click();
    await expect(page).toHaveURL(/\/video$/);
  });

  test('should navigate to admission form when clicking Apply Now in navbar', async ({ page, navPage, isMobile }) => {
    test.skip(isMobile, 'Desktop Apply Now CTA');
    await page.waitForLoadState('networkidle').catch(() => {});
    await expect(navPage.applyNowBtn).toBeVisible();
    await navPage.applyNowBtn.click();
    await expect(page).toHaveURL(/\/admission-form/, { timeout: 15000 });
  });

  test('should open mobile menu and display navigation links on mobile viewports', async ({ page, navPage, isMobile }) => {
    test.skip(!isMobile, 'Mobile-only drawer test');

    await expect(navPage.mobileMenuButton).toBeVisible();
    await navPage.openMobileMenu();

    // Verify links in drawer
    await expect(navPage.mobileNavDrawer.locator('a:has-text("Home")').first()).toBeVisible();
    await expect(navPage.mobileNavDrawer.locator('a:has-text("About Us")').first()).toBeVisible();
    await expect(navPage.mobileNavDrawer.locator('a:has-text("Admissions")').first()).toBeVisible();
    await expect(navPage.mobileNavDrawer.locator('a:has-text("Contact Us")').first()).toBeVisible();

    // Click Apply for Admission button in drawer
    const mobileApplyBtn = navPage.mobileNavDrawer.locator('a:has-text("Apply for Admission")');
    await expect(mobileApplyBtn).toBeVisible();
    await mobileApplyBtn.click();
    await expect(page).toHaveURL(/\/admission-form$/);
  });

  test('should display footer with branding, social links, and quick links', async ({ navPage, page }) => {
    await navPage.scrollToElement(navPage.footerElement);
    await expect(navPage.footerElement).toBeVisible();

    // Check footer quick links
    await expect(navPage.footerElement.locator('text=Meridian\'s').first()).toBeVisible();
    await expect(navPage.footerElement.locator('a[href*="facebook"]').first()).toBeVisible();
    await expect(navPage.footerElement.locator('a[href*="instagram"]').first()).toBeVisible();
    await expect(navPage.footerElement.locator('a[href*="youtube"]').first()).toBeVisible();
  });
});
