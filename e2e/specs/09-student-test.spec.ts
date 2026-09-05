import { test, expect } from '../fixtures/test-fixtures';

test.describe('Student Online Test Interface E2E Tests', () => {
  test('should display error message when test URL has no admission ID or student info', async ({ page }) => {
    await page.goto('/tests/invalid-test-id');
    await expect(
      page.locator('text=Invalid admission ID or student info').or(page.locator('text=Invalid test ID'))
    ).toBeVisible({ timeout: 10000 });
  });

  test('should load test interface for new student and allow taking test questions', async ({ page }) => {
    // Intercept test fetching for new student
    await page.route('**/api/admission/go-to-test**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          test: {
            _id: 'test_mock_123',
            title: 'Class 9 Admission Assessment',
            description: 'Basic Mathematics & English evaluation',
            class: 'Class 9',
            timeLimit: 60,
            totalMarks: 20,
            correctAnswerMarks: 10,
            passingMarks: 10,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            mcqs: [
              {
                question: 'What is 5 + 7?',
                options: ['10', '12', '14', '15'],
                correctAnswer: 1,
                marks: 10,
              },
              {
                question: 'Which of the following is a noun?',
                options: ['Run', 'Quickly', 'School', 'Bright'],
                correctAnswer: 2,
                marks: 10,
              },
            ],
          },
        }),
      });
    });

    await page.goto('/tests/new?studentName=Zubair%20Ahmed&class=Class%209');

    // 1. Verify start screen displays test title and instructions
    await expect(page.locator('h1:has-text("Class 9 Admission Assessment")')).toBeVisible({ timeout: 10000 });
    const startBtn = page.locator('button:has-text("Start Test")');
    await expect(startBtn).toBeVisible();

    // 2. Start the test
    await startBtn.click();

    // 3. Verify student name and first question
    await expect(page.locator('text=Zubair Ahmed')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=What is 5 + 7?')).toBeVisible({ timeout: 10000 });

    // 4. Select an option
    await page.locator('button:has-text("12")').click();

    // 5. Navigate to next question
    await page.locator('button:has-text("Next Question")').click();

    // 6. Verify second question appears
    await expect(page.locator('text=Which of the following is a noun?')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('button:has-text("Submit Test")')).toBeVisible();
  });

  test('should load test for existing student with valid admission ID', async ({ page }) => {
    await page.route('**/api/tests/test_existing_456', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          _id: 'test_existing_456',
          title: 'Class 10 Entry Examination',
          description: 'Science and Math entrance test',
          class: 'Class 10',
          timeLimit: 45,
          totalMarks: 10,
          correctAnswerMarks: 10,
          passingMarks: 5,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          mcqs: [
            {
              question: 'Chemical formula of water is?',
              options: ['H2O', 'CO2', 'NaCl', 'O2'],
              correctAnswer: 0,
              marks: 10,
            },
          ],
        }),
      });
    });

    await page.route('**/api/admission?id=adm_123', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          studentName: 'Sara Ahmed',
          selectedClass: 'Class 10',
        }),
      });
    });

    await page.goto('/tests/test_existing_456?admissionId=adm_123');
    await expect(page.locator('h1:has-text("Class 10 Entry Examination")')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('button:has-text("Start Test")')).toBeVisible();
  });
});
