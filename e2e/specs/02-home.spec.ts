import { test, expect } from '../fixtures/test-fixtures';

test.describe('Home Page E2E Tests', () => {
  test.beforeEach(async ({ homePage, apiMocks }) => {
    await homePage.load();
  });

  test('should load the home page with title and hero section', async ({ page, homePage }) => {
    await expect(homePage.heroHeading).toBeVisible();
    await expect(page).toHaveTitle(/Meridian/i);
  });

  test('should verify hero action buttons', async ({ page, homePage }) => {
    // Check Apply/Enroll Now in hero
    const heroApplyBtn = page.locator('a[href="/admission-form"]').first();
    await expect(heroApplyBtn).toBeVisible();

    // Check Explore button in hero
    const exploreBtn = page.locator('a[href="/about"], a[href="/programs"]').first();
    await expect(exploreBtn).toBeVisible();
  });

  test('should display key homepage sections and highlights', async ({ page, homePage }) => {
    // Why choose section
    const whyChooseUs = page.locator('text=Why Choose').first();
    await expect(whyChooseUs).toBeAttached();

    // Campus facilities
    const facilities = page.locator('text=Facilities').or(page.locator('text=Campus')).first();
    await expect(facilities).toBeAttached();
  });

  test('should handle newsletter subscription in footer with validation and success', async ({ page, homePage }) => {
    await homePage.scrollToElement(page.locator('footer'));

    // Try empty subscription
    await homePage.newsletterSubmitBtn.click();
    await homePage.expectToastMessage(/enter an email/i);

    // Enter valid email
    await homePage.subscribeNewsletter('student@example.com');
    await homePage.expectToastMessage(/Subscribed successfully/i);
  });

  test('should show already subscribed modal when duplicate email submitted', async ({ page, homePage }) => {
    await homePage.scrollToElement(page.locator('footer'));

    // Submit duplicate email
    await homePage.subscribeNewsletter('duplicate@example.com');
    const modal = page.locator('text=Already Subscribed').or(page.locator('[role="dialog"]'));
    await expect(modal.first()).toBeVisible({ timeout: 8000 });
  });
});
