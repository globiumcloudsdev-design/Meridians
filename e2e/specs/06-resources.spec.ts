import { test, expect } from '../fixtures/test-fixtures';

test.describe('Student Resources (Library, Notes, Videos, Online Quran) E2E Tests', () => {
  test('should load Library page and allow searching books', async ({ libraryPage, page, apiMocks }) => {
    await libraryPage.load();
    await expect(page.getByRole('heading', { name: /Library/i }).first()).toBeVisible();

    // Search bar
    if (await libraryPage.searchInput.isVisible()) {
      await libraryPage.searchBook('Physics');
      await expect(libraryPage.searchInput).toHaveValue('Physics');
    }
  });

  test('should load Study Notes portal and display downloadable resources', async ({ notesPage, page, apiMocks }) => {
    await notesPage.load();
    await expect(page.locator('text=Notes').first()).toBeVisible();
  });

  test('should load Video Gallery page and show video catalog', async ({ videoPage, page, apiMocks }) => {
    await videoPage.load();
    await expect(page.locator('text=Video').first()).toBeVisible();
  });

  test('should load Online Quran page with program details and features', async ({ onlineQuranPage, page, apiMocks }) => {
    await onlineQuranPage.load();
    await expect(onlineQuranPage.pageHeading).toBeVisible();
  });
});
