import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly heroHeading: Locator;
  readonly applyNowHeroBtn: Locator;
  readonly exploreProgramsBtn: Locator;
  readonly statsSection: Locator;
  readonly whyChooseUsSection: Locator;
  readonly facilitiesSection: Locator;
  readonly newsletterInput: Locator;
  readonly newsletterSubmitBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.heroHeading = page.locator('h1').first();
    this.applyNowHeroBtn = page.locator('a[href="/admission-form"]').first();
    this.exploreProgramsBtn = page.locator('a[href="/about"]').or(page.locator('a[href="/programs"]')).first();
    this.statsSection = page.locator('section').filter({ hasText: 'Students Enrolled' }).or(page.locator('text=Students Enrolled').first());
    this.whyChooseUsSection = page.locator('text=Why Choose').first();
    this.facilitiesSection = page.locator('text=Facilities').or(page.locator('text=Campus Facilities')).first();
    this.newsletterInput = page.locator('footer input[type="email"], footer input[placeholder*="email" i]');
    this.newsletterSubmitBtn = page.locator('footer button[type="submit"], footer button:has-text("Subscribe")');
  }

  async load() {
    await this.goto('/');
  }

  async subscribeNewsletter(email: string) {
    await this.newsletterInput.fill(email);
    await this.newsletterSubmitBtn.click();
  }
}
