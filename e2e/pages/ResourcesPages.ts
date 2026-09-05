import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LibraryPage extends BasePage {
  readonly searchInput: Locator;
  readonly classFilter: Locator;
  readonly booksList: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator('input[placeholder*="search" i]');
    this.classFilter = page.locator('select, [role="combobox"]').first();
    this.booksList = page.locator('div[class*="grid"], div[class*="card"]');
  }

  async load() {
    await this.goto('/library');
  }

  async searchBook(title: string) {
    await this.searchInput.fill(title);
  }
}

export class NotesPage extends BasePage {
  readonly searchInput: Locator;
  readonly notesList: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator('input[placeholder*="search" i]');
    this.notesList = page.locator('div[class*="grid"], div[class*="card"]');
  }

  async load() {
    await this.goto('/notes');
  }
}

export class VideoPage extends BasePage {
  readonly videoCards: Locator;

  constructor(page: Page) {
    super(page);
    this.videoCards = page.locator('iframe, video, div[class*="aspect-video"], div:has(svg.lucide-play)');
  }

  async load() {
    await this.goto('/video');
  }
}

export class OnlineQuranPage extends BasePage {
  readonly pageHeading: Locator;
  readonly enrollBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.locator('text=Quran').first();
    this.enrollBtn = page.locator('a[href*="contact"], a[href*="admission"]').first();
  }

  async load() {
    await this.goto('/online-quran');
  }
}
