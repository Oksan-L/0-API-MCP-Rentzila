import { APIRequestContext } from '@playwright/test';

export async function getAuthToken(request: APIRequestContext): Promise<string> {
  const res = await request.post('/api/auth/jwt/create/', {
    data: {
      email: process.env.TEST_EMAIL!,
      password: process.env.TEST_PASSWORD!,
    },
  });
  const body = await res.json();
  return body.access;
}