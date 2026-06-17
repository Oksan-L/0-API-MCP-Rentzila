// import { APIRequestContext } from '@playwright/test';

// export async function getAuthToken(request: APIRequestContext): Promise<string> {
//   const res = await request.post('/api/auth/jwt/create/', {
//     data: {
//       email: process.env.TEST_EMAIL!,
//       password: process.env.TEST_PASSWORD!,
//     },
//   });
//   const body = await res.json();
//   return body.access;
// }

import { APIRequestContext } from '@playwright/test';

export async function getAuthToken(
  request: APIRequestContext, 
  userType: 'user1' | 'user2' = 'user1'
): Promise<string> {
  
  const email = userType === 'user2' ? process.env.USER2_EMAIL! : process.env.TEST_EMAIL!;
  const password = userType === 'user2' ? process.env.USER2_PASSWORD! : process.env.TEST_PASSWORD!;

  const res = await request.post('/api/auth/jwt/create/', {
    data: { email, password },
  });
  const body = await res.json();
  return body.access;
}