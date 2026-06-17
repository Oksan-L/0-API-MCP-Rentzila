import { APIRequestContext } from '@playwright/test';

export class SearchAPI {
  constructor(private request: APIRequestContext) {}

  async search(query?: string) {
    return this.request.get('/api/search/', {
      params: query !== undefined ? { search: query } : undefined,
    });
  }

  async searchSort() {
    return this.request.get('/api/search-sort/');
  }
}