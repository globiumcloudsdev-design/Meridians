# End-to-End (E2E) Testing Suite - Meridian's Web Platform

Comprehensive End-to-End (E2E) automated testing suite powered by **[Playwright](https://playwright.dev)** for Next.js 16 and React 19.

---

## 📁 Architecture Overview

```
e2e/
├── fixtures/
│   └── test-fixtures.ts          # Custom Playwright fixtures (page objects & mock API setup)
├── helpers/
│   ├── auth-helper.ts            # Admin authentication & token injection helpers
│   └── mock-api.ts               # Route interception & deterministic mock responses
├── pages/                        # Page Object Model (POM) layer
│   ├── BasePage.ts               # Shared page behaviors, toast helpers, and navigation
│   ├── NavigationPage.ts         # Global header, navbar dropdowns, mobile menu, footer
│   ├── HomePage.ts               # Home hero, highlights, facilities, newsletter
│   ├── AdmissionFormPage.ts      # Multi-step online admission form wizard
│   ├── ContactPage.ts            # Contact inquiry form, maps, campus info
│   ├── ProgramsPage.ts           # Academic programs & curriculum courses
│   ├── ResourcesPages.ts         # Digital Library, Study Notes, Videos, Online Quran
│   ├── AdminLoginPage.ts         # Admin authentication, show/hide password, errors
│   ├── AdminDashboardPage.ts     # Admin overview metrics, sidebar navigation, logout
│   └── TestTakingPage.ts         # Online MCQ student assessment & timer
├── specs/                        # E2E Test Specifications
│   ├── 01-navigation.spec.ts     # Header navbar, mobile drawer, footer links
│   ├── 02-home.spec.ts           # Home page, sections, newsletter subscription
│   ├── 03-admission-form.spec.ts # Multi-step admission wizard & validation
│   ├── 04-contact.spec.ts        # Contact form validation & submission
│   ├── 05-programs.spec.ts       # Course details & academic offerings
│   ├── 06-resources.spec.ts      # Digital Library, Notes, Video gallery
│   ├── 07-admin-auth.spec.ts     # Admin login, password toggle, route protection
│   ├── 08-admin-dashboard.spec.ts# Admin metrics, sidebar collapse, management links
│   ├── 09-student-test.spec.ts   # Online student timed assessment
│   └── 10-api-routes.spec.ts     # Direct backend API endpoint contracts
├── playwright.config.ts          # Test runner config (webServer, browsers, reporting)
└── README.md                     # Documentation and usage guide
```

---

## 🚀 Running the Tests

### 1. Run all E2E tests (Headless mode)
```bash
npm run test:e2e
```

### 2. Run with Interactive UI Mode (recommended for development)
```bash
npm run test:e2e:ui
```

### 3. Run with Headed Browser (watch test execution visually)
```bash
npm run test:e2e:headed
```

### 4. Run a specific test suite
```bash
npx playwright test e2e/specs/01-navigation.spec.ts
npx playwright test e2e/specs/03-admission-form.spec.ts
npx playwright test e2e/specs/07-admin-auth.spec.ts
```

### 5. View Test HTML Report & Traces
```bash
npm run test:e2e:report
```

---

## 🛡️ Key Features Tested

1. **Global Navigation & Responsive Layout**:
   - Brand logo, desktop navbar, dropdown submenus.
   - Mobile hamburger menu drawer with smooth animation.
   - Footer links, social channels, and copyright notice.

2. **Multi-Step Online Admission Form**:
   - Reference number (MSS-XXXXXX) generation.
   - Step 1: Personal & Family Information with field-level validations.
   - Step 2: Academic Program selection (Pre-School, Primary, Middle, Matric, Intermediate).
   - Multi-step persistence and backward/forward navigation.

3. **Contact & Newsletter Flow**:
   - Input validation for required fields.
   - Success toast notifications on valid submission.
   - Duplicate newsletter subscription detection with modal prompt.

4. **Admin Portal Security & Management**:
   - Show / Hide password visibility toggle.
   - Credential validation and failure feedback.
   - Protected route guards redirecting unauthorized visitors to `/admin/login`.
   - Admin dashboard metric cards and collapsible sidebar navigation.
   - Clean logout flow.

5. **Student Online Assessment**:
   - Parameter validation for new students.
   - MCQ question loading, option selection, and score evaluation.

6. **API Contracts**:
   - Status codes and payload validation across login, contact, and subscriber endpoints.
