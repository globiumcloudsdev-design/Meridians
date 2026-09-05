import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ContactPage extends BasePage {
  readonly heroSection: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly messageInput: Locator;
  readonly submitButton: Locator;
  readonly campusCards: Locator;

  constructor(page: Page) {
    super(page);
    this.heroSection = page.locator('text=Connect').first();
    this.nameInput = page.locator('input#name, input[name="name"]');
    this.emailInput = page.locator('input#email, input[name="email"]');
    this.messageInput = page.locator('textarea#message, textarea[name="message"]');
    this.submitButton = page.locator('button[type="submit"]:has-text("Send Message")');
    this.campusCards = page.locator('text=Campus, text=Gulshan, text=Nazimabad');
  }

  async load() {
    await this.goto('/contact');
  }

  async submitContactForm(data: { name: string; email: string; message: string }) {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    await this.messageInput.fill(data.message);
    await this.submitButton.click();
  }
}
