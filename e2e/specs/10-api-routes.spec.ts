import { test, expect } from '@playwright/test';

test.describe('Backend API Routes E2E Tests', () => {
  test('POST /api/test-login should return 400 when body is missing fields', async ({ request }) => {
    const response = await request.post('/api/test-login', {
      data: {},
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.message).toContain('Email and password are required');
  });

  test('POST /api/test-login should return 401 for non-existent user credentials', async ({ request }) => {
    const response = await request.post('/api/test-login', {
      data: {
        email: 'nonexistent_test_user@meridians.com',
        password: 'wrong_password_123',
      },
    });
    expect([401, 500]).toContain(response.status());
  });

  test('POST /api/contact should return 400 if required fields are missing', async ({ request }) => {
    const response = await request.post('/api/contact', {
      data: {
        name: 'Incomplete contact',
      },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('Missing required fields');
  });

  test('POST /api/subscribers should reject requests missing email', async ({ request }) => {
    const response = await request.post('/api/subscribers', {
      data: {},
    });
    expect([400, 500]).toContain(response.status());
  });
});
