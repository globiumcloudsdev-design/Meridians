import { test as baseTest, expect } from '@playwright/test';
import { NavigationPage } from '../pages/NavigationPage';
import { HomePage } from '../pages/HomePage';
import { AdmissionFormPage } from '../pages/AdmissionFormPage';
import { ContactPage } from '../pages/ContactPage';
import { ProgramsPage } from '../pages/ProgramsPage';
import { LibraryPage, NotesPage, VideoPage, OnlineQuranPage } from '../pages/ResourcesPages';
import { AdminLoginPage } from '../pages/AdminLoginPage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { TestTakingPage } from '../pages/TestTakingPage';
import { setupApiMocks } from '../helpers/mock-api';

type CustomFixtures = {
  navPage: NavigationPage;
  homePage: HomePage;
  admissionPage: AdmissionFormPage;
  contactPage: ContactPage;
  programsPage: ProgramsPage;
  libraryPage: LibraryPage;
  notesPage: NotesPage;
  videoPage: VideoPage;
  onlineQuranPage: OnlineQuranPage;
  adminLoginPage: AdminLoginPage;
  adminDashboardPage: AdminDashboardPage;
  testTakingPage: TestTakingPage;
  apiMocks: void;
};

export const test = baseTest.extend<CustomFixtures>({
  apiMocks: [async ({ page }, use) => {
    await setupApiMocks(page);
    await use();
  }, { auto: true }],
  navPage: async ({ page }, use) => {
    await use(new NavigationPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  admissionPage: async ({ page }, use) => {
    await use(new AdmissionFormPage(page));
  },
  contactPage: async ({ page }, use) => {
    await use(new ContactPage(page));
  },
  programsPage: async ({ page }, use) => {
    await use(new ProgramsPage(page));
  },
  libraryPage: async ({ page }, use) => {
    await use(new LibraryPage(page));
  },
  notesPage: async ({ page }, use) => {
    await use(new NotesPage(page));
  },
  videoPage: async ({ page }, use) => {
    await use(new VideoPage(page));
  },
  onlineQuranPage: async ({ page }, use) => {
    await use(new OnlineQuranPage(page));
  },
  adminLoginPage: async ({ page }, use) => {
    await use(new AdminLoginPage(page));
  },
  adminDashboardPage: async ({ page }, use) => {
    await use(new AdminDashboardPage(page));
  },
  testTakingPage: async ({ page }, use) => {
    await use(new TestTakingPage(page));
  },
});

export { expect };
