import { test, expect } from '@playwright/test';
import { AuthAPI } from '../../api/endpoints/auth';

test.describe('POST /api/auth/jwt/create/ @auth @smoke', () => {
  let auth: AuthAPI;

  test.beforeEach(({ request }) => {
    auth = new AuthAPI(request);
  });

  // Happy path
  test('valid credentials return access and refresh tokens @auth @smoke', async () => {
    const res = await auth.login(
      process.env.TEST_EMAIL!,
      process.env.TEST_PASSWORD!
    );

    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body).toHaveProperty('access');
    expect(body).toHaveProperty('refresh');
    expect(typeof body.access).toBe('string');
    expect(typeof body.refresh).toBe('string');
  });

  // Negative
  test('wrong password returns 400 @auth', async () => {
    const res = await auth.login('user@test.com', 'wrongpassword');
    expect(res.status()).toBe(400);
  });

  test('empty body returns 400 @auth', async () => {
    const res = await auth.login('', '');
    expect(res.status()).toBe(400);
  });

  test('non-existent email returns 400 @auth', async () => {
    const res = await auth.login('notexist_12345@test.com', 'somePassword1!');
    expect(res.status()).toBe(400);
  });

  test('missing password field returns 400 @auth', async () => {
    const res = await auth.loginRaw({ email: process.env.TEST_EMAIL });
    expect(res.status()).toBe(400);
  });

  test('missing email field returns 400 @auth', async () => {
    const res = await auth.loginRaw({ password: process.env.TEST_PASSWORD });
    expect(res.status()).toBe(400);
  });

  test('invalid email format returns 400 @auth', async () => {
    const res = await auth.login('not-an-email', 'somePassword1!');
    expect(res.status()).toBe(400);
  });
});