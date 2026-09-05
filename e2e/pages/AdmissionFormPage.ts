import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AdmissionFormPage extends BasePage {
  readonly refBadge: Locator;
  readonly step1Indicator: Locator;
  readonly step2Indicator: Locator;
  readonly step3Indicator: Locator;

  // Step 1 locators
  readonly campusSelect: Locator;
  readonly studentNameInput: Locator;
  readonly fatherNameInput: Locator;
  readonly dobInput: Locator;
  readonly mobileInput: Locator;
  readonly emailInput: Locator;
  readonly presentAddressInput: Locator;
  readonly guardianCnicInput: Locator;
  readonly nextToAcademicBtn: Locator;

  // Step 2 locators
  readonly prevStepBtn: Locator;
  readonly nextToDocumentsBtn: Locator;

  // Step 3 locators
  readonly agreeRulesCheckbox: Locator;
  readonly parentSigInput: Locator;
  readonly studentSigInput: Locator;
  readonly submitBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.refBadge = page.locator('text=Meridian').or(page.locator('text=Admission')).first();
    this.step1Indicator = page.locator('text=Personal Info').or(page.locator('text=Personal Information')).first();
    this.step2Indicator = page.locator('text=Academic Info').or(page.locator('text=Academic Information')).first();
    this.step3Indicator = page.locator('text=Documents').first();

    // Step 1
    this.campusSelect = page.locator('select').first();
    this.studentNameInput = page.locator('input[placeholder*="B-Form" i]').first();
    this.fatherNameInput = page.locator('input[placeholder="Full name"]').first();
    this.dobInput = page.locator('input[type="date"]').first();
    this.mobileInput = page.locator('input[placeholder*="3XX-XXXXXXX"]').first();
    this.emailInput = page.locator('input[placeholder*="example.com"], input[type="email"]').first();
    this.presentAddressInput = page.locator('textarea[placeholder*="House" i]').first();
    this.guardianCnicInput = page.locator('input[placeholder="00000-0000000-0"]').last();
    this.nextToAcademicBtn = page.locator('button:has-text("Next: Academic Info")');

    // Step 2
    this.prevStepBtn = page.locator('button:has-text("Previous")').first();
    this.nextToDocumentsBtn = page.locator('button:has-text("Next: Documents")');

    // Step 3
    this.agreeRulesCheckbox = page.locator('input[type="checkbox"]').first();
    this.parentSigInput = page.locator('input[placeholder*="parent" i], input[placeholder*="guardian signature" i]').first();
    this.studentSigInput = page.locator('input[placeholder*="student signature" i], input[placeholder*="applicant signature" i]').first();
    this.submitBtn = page.locator('button:has-text("Submit")');
  }

  async load() {
    await this.goto('/admission-form');
    await this.page.waitForSelector('text=MSS-');
  }

  async selectCampus(campusName: string) {
    if (await this.campusSelect.isVisible()) {
      await this.campusSelect.selectOption(campusName);
    }
  }

  async fillStep1(data: {
    studentName: string;
    fatherName: string;
    dob: string;
    mobile: string;
    email: string;
    address: string;
    guardianCnic: string;
    campus?: string;
  }) {
    await this.studentNameInput.fill(data.studentName);
    await this.fatherNameInput.fill(data.fatherName);
    await this.dobInput.fill(data.dob);
    await this.mobileInput.fill(data.mobile);
    await this.emailInput.fill(data.email);
    await this.presentAddressInput.fill(data.address);
    await this.guardianCnicInput.fill(data.guardianCnic);
  }

  async clickNextToAcademic() {
    await this.nextToAcademicBtn.click();
  }

  async clickNextToDocuments() {
    await this.nextToDocumentsBtn.click();
  }

  async clickPrevious() {
    await this.prevStepBtn.click();
  }
}
