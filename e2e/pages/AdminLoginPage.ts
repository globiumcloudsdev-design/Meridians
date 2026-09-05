import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AdminLoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly togglePasswordBtn: Locator;
  readonly signInBtn: Locator;
  readonly logoImage: Locator;
  readonly adminTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('input#email');
    this.passwordInput = page.locator('input#password');
    this.togglePasswordBtn = page.locator('button:has(svg.lucide-eye), button:has(svg.lucide-eye-off)');
    this.signInBtn = page.locator('button[type="submit"]:has-text("SIGN IN")');
    this.logoImage = page.locator('img[alt*="Meridian"]').first();
    this.adminTitle = page.locator('h2:has-text("Admin Login")');
  }

  async load() {
    await this.goto('/admin/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInBtn.click();
  }

  async togglePasswordVisibility() {
    await this.togglePasswordBtn.click();
  }
}
