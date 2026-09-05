import { test, expect } from '../fixtures/test-fixtures';

test.describe('Contact Page & Form Submission E2E Tests', () => {
  test.beforeEach(async ({ contactPage, apiMocks }) => {
    await contactPage.load();
  });

  test('should render contact page hero and contact cards', async ({ page, contactPage }) => {
    await expect(contactPage.heroSection).toBeVisible();
    await expect(page.locator('text=Connect With Us').or(page.locator('text=Get in Touch')).first()).toBeVisible();
    await expect(page.locator('text=Karachi, Pakistan').or(page.locator('text=Campus')).first()).toBeVisible();
  });

  test('should display validation toast when submitting empty contact form', async ({ page, contactPage }) => {
    await contactPage.scrollToElement(contactPage.submitButton);
    await contactPage.submitButton.click();
    await contactPage.expectToastMessage(/fill in all fields/i);
  });

  test('should submit contact message successfully and reset form', async ({ contactPage }) => {
    await contactPage.submitContactForm({
      name: 'Usman Ghani',
      email: 'usman@example.com',
      message: 'I would like to inquire about admission criteria for Matric science stream.',
    });

    await contactPage.expectToastMessage(/Message sent successfully/i);

    // Verify form input fields are cleared
    await expect(contactPage.nameInput).toHaveValue('');
    await expect(contactPage.emailInput).toHaveValue('');
    await expect(contactPage.messageInput).toHaveValue('');
  });
});
