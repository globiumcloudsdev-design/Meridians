import { test, expect } from '../fixtures/test-fixtures';

test.describe('Academic Programs & Course Details E2E Tests', () => {
  test.beforeEach(async ({ programsPage, apiMocks }) => {
    await programsPage.load();
  });

  test('should render programs page with hero banner and curriculum offerings', async ({ page, programsPage }) => {
    await expect(programsPage.heroSection).toBeVisible();

    // Verify key sections
    const preSection = page.locator('text=Pre Section').or(page.locator('text=Primary Education')).first();
    const secondarySection = page.locator('text=Secondary Education').or(page.locator('text=Matric')).first();
    const interSection = page.locator('text=Higher Secondary Education').or(page.locator('text=Intermediate')).first();

    await expect(preSection).toBeVisible();
    await expect(secondarySection).toBeVisible();
    await expect(interSection).toBeVisible();
  });

  test('should verify enrollment CTA buttons redirect to admission form', async ({ page, programsPage }) => {
    const applyButton = page.locator('a[href*="admission"]').first();
    await expect(applyButton).toBeVisible();
    await applyButton.click();
    await expect(page).toHaveURL(/admission-form|admissions/);
  });
});
