import { APIRequestContext } from '@playwright/test';

export class ReviewsAPI {
  constructor(private request: APIRequestContext) {}

  async getReviews(token: string, params?: Record<string, string | number>) {
    return this.request.get('/api/reviews/', {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
  }

  async createReview(token: string, data: Record<string, unknown>) {
    return this.request.post('/api/reviews/', {
      headers: { Authorization: `Bearer ${token}` },
      data,
    });
  }
}