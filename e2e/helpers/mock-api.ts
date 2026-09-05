import { Page, Route } from '@playwright/test';

export interface MockDataOptions {
  user?: { id: string; email: string; role: string };
  token?: string;
  contactSuccess?: boolean;
  subscriberSuccess?: boolean;
}

export async function setupApiMocks(page: Page, options: MockDataOptions = {}) {
  const defaultUser = {
    _id: 'admin_test_123',
    id: 'admin_test_123',
    name: 'Admin User',
    email: 'admin@meridians.com',
    role: 'admin',
    createdAt: new Date().toISOString(),
    ...options.user,
  };
  const defaultToken = options.token || 'mock_jwt_token_for_playwright_test';

  // Mock /api/test-login
  await page.route('**/api/test-login', async (route: Route) => {
    const request = route.request();
    if (request.method() === 'POST') {
      const body = JSON.parse(request.postData() || '{}');
      if (body.email === 'admin@meridians.com' && body.password === 'admin123') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            token: defaultToken,
            user: defaultUser,
          }),
        });
      } else {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Invalid email or password.' }),
        });
      }
    } else {
      await route.continue();
    }
  });

  // Mock /api/test-profile
  await page.route('**/api/test-profile', async (route: Route) => {
    const authHeader = route.request().headers()['authorization'];
    if (authHeader && authHeader.includes('Bearer')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ user: defaultUser }),
      });
    } else {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Unauthorized' }),
      });
    }
  });

  // Mock /api/contact
  await page.route('**/api/contact', async (route: Route) => {
    if (route.request().method() === 'POST') {
      const body = JSON.parse(route.request().postData() || '{}');
      if (!body.name || !body.email || !body.message) {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Missing required fields' }),
        });
      } else {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Contact message saved successfully',
            id: 'mock_contact_id_123',
          }),
        });
      }
    } else {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { _id: '1', name: 'John Doe', email: 'john@example.com', message: 'Hello Meridians' },
        ]),
      });
    }
  });

  // Mock /api/subscribers
  await page.route('**/api/subscribers', async (route: Route) => {
    if (route.request().method() === 'POST') {
      const body = JSON.parse(route.request().postData() || '{}');
      if (body.email === 'duplicate@example.com') {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Already subscribed with this email' }),
        });
      } else {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Subscribed successfully' }),
        });
      }
    } else {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ _id: '1', email: 'user@example.com' }]),
      });
    }
  });

  // Mock /api/admission
  await page.route('**/api/admission**', async (route: Route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Admission form submitted successfully',
          id: 'mock_admission_id_999',
        }),
      });
    } else {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            _id: 'mock_admission_1',
            studentName: 'Ali Khan',
            campus: 'Main Campus',
            selectedClass: 'Class 9',
            status: 'pending',
          },
        ]),
      });
    }
  });

  // Mock /api/blog
  await page.route('**/api/blog**', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          _id: 'b1',
          title: 'Welcome to Academic Year 2026',
          slug: 'welcome-2026',
          status: 'published',
          excerpt: 'Highlights and orientation details',
          createdAt: new Date().toISOString(),
        },
      ]),
    });
  });

  // Mock /api/classes
  await page.route('**/api/classes**', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { _id: 'c1', name: 'Class 9', section: 'A' },
        { _id: 'c2', name: 'Class 10', section: 'B' },
      ]),
    });
  });

  // Mock /api/timeline
  await page.route('**/api/timeline**', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          _id: 't1',
          title: 'Admissions Open',
          date: '2026-09-01',
          description: 'Fall 2026 admissions open for all campuses',
          icon: 'Calendar',
          order: 1,
        },
        {
          _id: 't2',
          title: 'Entry Assessment',
          date: '2026-09-15',
          description: 'Entry tests and evaluations',
          icon: 'ClipboardCheck',
          order: 2,
        },
      ]),
    });
  });

  // Mock /api/posters
  await page.route('**/api/posters**', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    });
  });

  // Mock /api/videos
  await page.route('**/api/videos**', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    });
  });

  // Mock /api/library
  await page.route('**/api/library**', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          _id: 'l1',
          title: 'Physics Fundamentals',
          category: 'Physics',
          class: 'Class 9',
          author: 'Dr. H. Khan',
        },
      ]),
    });
  });

  // Mock /api/notes
  await page.route('**/api/notes**', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          _id: 'n1',
          title: 'Mathematics Chapter 1 Notes',
          subject: 'Mathematics',
          class: 'Class 9',
        },
      ]),
    });
  });
}
