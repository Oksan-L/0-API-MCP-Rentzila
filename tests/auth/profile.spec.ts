import { test, expect } from '@playwright/test';
import { AuthAPI } from '../../api/endpoints/auth';
import { getAuthToken } from '../../helpers/auth-helper';

test.describe('GET /api/auth/users/me/ @auth @me', () => {
  let auth: AuthAPI;
  let token: string;

  test.beforeAll(async ({ request }) => {
    token = await getAuthToken(request);
  });

  test.beforeEach(({ request }) => {
    auth = new AuthAPI(request);
  });

  // GET /me/
  test('authorized user gets own profile @auth @smoke', async () => {
    const res = await auth.getProfile(token);

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('email');
    expect(body).toHaveProperty('id');
    expect(typeof body.email).toBe('string');
  });

  test('request without token returns 403 @auth', async () => {
    const res = await auth.getProfile('');
    // NOTE: returns 403 instead of standard 401 for unauthenticated requests
    expect(res.status()).toBe(403);
  });

  test('request with invalid token returns 403 @auth', async () => {
    const res = await auth.getProfile('invalid.token.here');
    // NOTE: returns 403 instead of standard 401 for unauthenticated requests
    expect(res.status()).toBe(403);
  });

  // PATCH /me/
  test('authorized user can update first name @auth', async () => {
    const res = await auth.updateProfile(token, { first_name: 'TestName' });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.first_name).toBe('TestName');
  });

  test('update profile without token returns 403 @auth', async () => {
    const res = await auth.updateProfile('', { first_name: 'TestName' });
    // NOTE: returns 403 instead of standard 401 for unauthenticated requests
    expect(res.status()).toBe(403);
  });
});