import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProgramsPage extends BasePage {
  readonly heroSection: Locator;
  readonly programCards: Locator;
  readonly ctaSection: Locator;

  constructor(page: Page) {
    super(page);
    this.heroSection = page.locator('text=Course Details').or(page.locator('text=Academic Programs')).first();
    this.programCards = page.locator('div.group, .rounded-3xl, [class*="card"]');
    this.ctaSection = page.locator('text=Ready to Join').or(page.locator('text=Apply for Admission')).first();
  }

  async load() {
    await this.goto('/programs');
  }

  getProgramCard(title: string): Locator {
    return this.page.locator(`h3:has-text("${title}")`).first();
  }
}
