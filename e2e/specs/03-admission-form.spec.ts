import { test, expect } from '../fixtures/test-fixtures';

test.describe('Online Admission Form Multi-Step Wizard E2E Tests', () => {
  test.beforeEach(async ({ admissionPage, apiMocks }) => {
    await admissionPage.load();
  });

  test('should render admission form with wizard step indicators and reference ID', async ({ page, admissionPage }) => {
    await expect(admissionPage.refBadge.first()).toBeVisible();
    await expect(admissionPage.step1Indicator.first()).toBeVisible();
  });

  test('should show validation error when proceeding with empty fields in Step 1', async ({ admissionPage }) => {
    await admissionPage.clickNextToAcademic();
    await admissionPage.expectToastMessage(/Please fill in all required fields in Step 1/i);
  });

  test('should fill Step 1 personal details and proceed to Step 2 Academic Info', async ({ page, admissionPage }) => {
    await admissionPage.fillStep1({
      campus: 'Main Campus',
      studentName: 'Ahmad Raza',
      fatherName: 'Muhammad Raza',
      dob: '2008-05-14',
      mobile: '3001234567',
      email: 'ahmad.raza@example.com',
      address: 'House # 123, Street 4, Sector 5, Karachi',
      guardianCnic: '42101-1234567-1',
    });

    await admissionPage.clickNextToAcademic();

    // Verify Step 2 is reached
    await expect(page.locator('text=Step 02').or(page.locator('text=Academic Information')).first()).toBeVisible();
    await expect(admissionPage.prevStepBtn).toBeVisible();
  });

  test('should support navigating back and forth between wizard steps with persisted data', async ({ page, admissionPage }) => {
    // Fill Step 1
    await admissionPage.fillStep1({
      campus: 'Main Campus',
      studentName: 'Fatima Noor',
      fatherName: 'Tariq Noor',
      dob: '2010-02-20',
      mobile: '3019876543',
      email: 'fatima@example.com',
      address: 'Flat 5B, Block 13, Gulshan-e-Iqbal',
      guardianCnic: '42101-7654321-9',
    });

    await admissionPage.clickNextToAcademic();
    await expect(page.locator('text=Step 02').or(page.locator('text=Academic Information')).first()).toBeVisible();

    // Click Previous back to Step 1
    await admissionPage.clickPrevious();

    // Verify Step 1 is visible again and studentName has persisted
    await expect(admissionPage.studentNameInput).toHaveValue('Fatima Noor');
  });
});
