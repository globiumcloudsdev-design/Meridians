import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string = '/') {
    await this.page.goto(path, { waitUntil: 'load' });
  }

  async waitForPageLoaded() {
    await this.page.waitForLoadState('load');
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async expectUrlToContain(subPath: string) {
    await expect(this.page).toHaveURL(new RegExp(subPath));
  }

  async expectToastMessage(text: string | RegExp) {
    const toast = this.page.locator('[data-sonner-toast], [role="status"], div[role="alert"]');
    await expect(toast.filter({ hasText: text }).first()).toBeVisible({ timeout: 8000 });
  }

  async scrollToElement(locator: Locator) {
    await locator.scrollIntoViewIfNeeded();
  }
}
