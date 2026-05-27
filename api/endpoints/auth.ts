import { APIRequestContext } from '@playwright/test';

export class AuthAPI {
  constructor(private request: APIRequestContext) {}

  async login(email: string, password: string) {
    return this.request.post('/api/auth/jwt/create/', {
      data: { email, password },
    });
  }

  async loginRaw(data: Record<string, unknown>) {
    return this.request.post('/api/auth/jwt/create/', { data });
  }

  async refreshToken(refresh: string) {
    return this.request.post('/api/auth/jwt/refresh/', {
      data: { refresh },
    });
  }

  async getProfile(token: string) {
  return this.request.get('/api/auth/users/me/', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

async updateProfile(token: string, data: Record<string, unknown>) {
  return this.request.patch('/api/auth/users/me/', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  });
}
}