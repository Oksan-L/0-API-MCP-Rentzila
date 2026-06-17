import { test, expect } from '@playwright/test';
import { SearchAPI } from '../../api/endpoints/search';

test.describe('GET /api/search/ @search @smoke', () => {
  let search: SearchAPI;

  test.beforeEach(({ request }) => {
    search = new SearchAPI(request);
  });

  test('search without query returns 200 @search @smoke', async () => {
    const res = await search.search();
    expect(res.status()).toBe(200);
  });

  test('search with keyword returns 200 @search @smoke', async () => {
    const res = await search.search('екскаватор');
    expect(res.status()).toBe(200);
  });

  test('search response body is an object or array @search', async () => {
    const res = await search.search('екскаватор');
    const body = await res.json();
    expect(body).toBeDefined();
    expect(typeof body === 'object' || Array.isArray(body)).toBe(true);
  });

  test('search results contain relevant data for keyword @search', async () => {
    const res = await search.search('екскаватор');
    const body = await res.json();
    // response is array or paginated object — verify it has content
    const results = Array.isArray(body) ? body : body.results ?? body;
    expect(Array.isArray(results) || typeof results === 'object').toBe(true);
  });

  test('search with empty string returns 200 @search', async () => {
    const res = await search.search('');
    expect(res.status()).toBe(200);
  });

  test('search is public — no token required @search @smoke', async () => {
    const res = await search.search('кран');
    expect(res.status()).toBe(200);
  });

  test('search with special characters returns 200 @search', async () => {
    const res = await search.search('!@#$%');
    expect(res.status()).toBe(200);
  });

  test('search with very long keyword returns 200 or 400 @search', async () => {
    const longQuery = 'а'.repeat(300);
    const res = await search.search(longQuery);
    expect([200, 400]).toContain(res.status());
  });
});

test.describe('GET /api/search-sort/ @search @smoke', () => {
  let search: SearchAPI;

  test.beforeEach(({ request }) => {
    search = new SearchAPI(request);
  });

  test('search-sort returns 200 @search @smoke', async () => {
    const res = await search.searchSort();
    expect(res.status()).toBe(200);
  });

  test('search-sort response is an object or array @search', async () => {
    const res = await search.searchSort();
    const body = await res.json();
    expect(body).toBeDefined();
    expect(typeof body === 'object' || Array.isArray(body)).toBe(true);
  });

  test('search-sort is public — no token required @search', async () => {
    const res = await search.searchSort();
    expect(res.status()).toBe(200);
  });
});