import { APIRequestContext } from '@playwright/test';

export class CategoryAPI {
  constructor(private request: APIRequestContext) {}

  async getCategories(params?: Record<string, string | number>) {
    return this.request.get('/api/category/', { params });
  }

  async getCategoryById(id: number) {
    return this.request.get(`/api/category/${id}/`);
  }
}
