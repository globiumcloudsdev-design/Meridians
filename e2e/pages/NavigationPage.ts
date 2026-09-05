import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class NavigationPage extends BasePage {
  readonly navElement: Locator;
  readonly logoLink: Locator;
  readonly brandName: Locator;
  readonly applyNowBtn: Locator;
  readonly mobileMenuButton: Locator;
  readonly mobileNavDrawer: Locator;
  readonly resourcesDropdownTrigger: Locator;
  readonly footerElement: Locator;

  constructor(page: Page) {
    super(page);
    this.navElement = page.locator('nav');
    this.logoLink = page.locator('nav a[href="/"]').first();
    this.brandName = page.locator('nav h1', { hasText: "Meridian's" });
    this.applyNowBtn = page.locator('nav a:has-text("Apply Now")').first();
    this.mobileMenuButton = page.locator('nav button.md\\:hidden');
    this.mobileNavDrawer = page.locator('nav .md\\:hidden.overflow-hidden');
    this.resourcesDropdownTrigger = page.locator('nav .md\\:flex button:has-text("Resources"), nav button:has-text("Resources")').first();
    this.footerElement = page.locator('footer');
  }

  getNavLink(label: string): Locator {
    return this.navElement.locator('.md\\:flex').getByRole('link', { name: label, exact: true });
  }

  async openResourcesDropdown() {
    await this.page.waitForLoadState('networkidle').catch(() => {});
    const menu = this.navElement.locator('[role="menu"]');
    if (!(await menu.isVisible())) {
      await this.resourcesDropdownTrigger.hover();
      if (!(await menu.isVisible())) {
        await this.resourcesDropdownTrigger.click();
      }
    }
  }

  async openMobileMenu() {
    if (await this.mobileMenuButton.isVisible()) {
      await this.page.waitForLoadState('networkidle').catch(() => {});
      await this.mobileMenuButton.click();
      try {
        await expect(this.mobileNavDrawer).toBeVisible({ timeout: 3000 });
      } catch {
        await this.mobileMenuButton.click();
        await expect(this.mobileNavDrawer).toBeVisible();
      }
    }
  }

  async closeMobileMenu() {
    if (await this.mobileMenuButton.isVisible()) {
      await this.mobileMenuButton.click();
    }
  }

  async navigateTo(path: string) {
    await this.goto(path);
  }
}
