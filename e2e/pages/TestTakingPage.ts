import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class TestTakingPage extends BasePage {
  readonly startTestBtn: Locator;
  readonly questionHeading: Locator;
  readonly timerDisplay: Locator;
  readonly optionsList: Locator;
  readonly nextBtn: Locator;
  readonly submitBtn: Locator;
  readonly resultModal: Locator;

  constructor(page: Page) {
    super(page);
    this.startTestBtn = page.locator('button:has-text("Start Test"), button:has-text("Begin Test")');
    this.questionHeading = page.locator('h3, h2').filter({ hasText: 'Question' });
    this.timerDisplay = page.locator('text=Time Left, text=seconds');
    this.optionsList = page.locator('button[class*="option"], div[class*="option"]');
    this.nextBtn = page.locator('button:has-text("Next Question"), button:has-text("Next")');
    this.submitBtn = page.locator('button:has-text("Submit Test")');
    this.resultModal = page.locator('text=Test Result, text=Test Completed, text=Your Score');
  }

  async load(testId: string = 'demo-test-id') {
    await this.goto(`/tests/${testId}`);
  }

  async startTest() {
    await this.startTestBtn.click();
  }

  async selectOption(index: number = 0) {
    await this.optionsList.nth(index).click();
  }

  async nextQuestion() {
    await this.nextBtn.click();
  }

  async submit() {
    await this.submitBtn.click();
  }
}
