import { test, expect } from '@playwright/test';
import { AuthAPI } from '../../api/endpoints/auth';

test.describe('POST /api/auth/jwt/refresh/ @auth', () => {
  let auth: AuthAPI;

  test.beforeEach(({ request }) => {
    auth = new AuthAPI(request);
  });

  test('valid refresh token returns new access token @auth @smoke', async () => {
    // get refresh token through login
    const loginRes = await auth.login(
      process.env.TEST_EMAIL!,
      process.env.TEST_PASSWORD!
    );
    const { refresh } = await loginRes.json();

    const res = await auth.refreshToken(refresh);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('access');
    expect(typeof body.access).toBe('string');
  });

  test('invalid refresh token returns 401 @auth', async () => {
    const res = await auth.refreshToken('invalid.token.here');
    // BUG: should return 401 Unauthorized, but currently returns 406 Not Acceptable
    expect(res.status()).toBe(401);
  });

  test('empty refresh token returns 400 @auth', async () => {
    const res = await auth.refreshToken('');
    // BUG: should return 400 Bad Request, but currently returns 500 Internal Server Error
    expect(res.status()).toBe(400);
  });
});