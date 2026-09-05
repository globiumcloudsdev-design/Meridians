import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AdminDashboardPage extends BasePage {
  readonly dashboardHeading: Locator;
  readonly sidebar: Locator;
  readonly sidebarCollapseBtn: Locator;
  readonly blogCard: Locator;
  readonly subscribersCard: Locator;
  readonly contactCard: Locator;
  readonly admissionCard: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.dashboardHeading = page.locator('h1:has-text("Dashboard")').first();
    this.sidebar = page.locator('aside').first();
    this.sidebarCollapseBtn = page.locator('aside button[aria-label*="sidebar" i], button[aria-label*="sidebar" i]').first();
    this.blogCard = page.locator('text=Blog Posts').first();
    this.subscribersCard = page.locator('text=Subscribers').first();
    this.contactCard = page.locator('text=Contact Messages').first();
    this.admissionCard = page.locator('text=Admission Queries').first();
    this.logoutButton = page.locator('button[title="Logout"], button:has-text("Logout"), button:has(svg.lucide-log-out)').first();
  }

  async load() {
    await this.goto('/admin/dashboard');
  }

  getSidebarLink(label: string): Locator {
    return this.page.locator(`aside nav a:has-text("${label}")`).first();
  }

  async logout() {
    await this.logoutButton.click();
  }
}
