import { test, expect } from '@playwright/test';
import { CategoryAPI } from '../../api/endpoints/category';

test.describe('GET /api/category/ @category @smoke', () => {
  let categories: CategoryAPI;

  test.beforeEach(({ request }) => {
    categories = new CategoryAPI(request);
  });

  test.setTimeout(60000);

  test('returns 200 with array of categories @category @smoke', async () => {
    const res = await categories.getCategories();
    expect(res.status()).toBe(200);
    const body = await res.json();

    if (Array.isArray(body)) {
      expect(Array.isArray(body)).toBe(true);
    } else {
      expect(body).toHaveProperty('results');
      expect(Array.isArray(body.results)).toBe(true);
    }
  });

  test('each category has required fields id, name, level @category', async () => {
    const res = await categories.getCategories({ size: 3 });
    expect(res.status()).toBe(200);
    const body = await res.json();
    const list = Array.isArray(body) ? body : body.results;

    expect(Array.isArray(list)).toBe(true);

    for (const c of list.slice(0, 10)) {
      expect(c).toHaveProperty('id');
      expect(c).toHaveProperty('name');
      expect(c).toHaveProperty('level');
      expect(typeof c.id).toBe('number');
      expect(typeof c.name).toBe('string');
      expect(typeof c.level).toBe('number');
      expect(c.level).toBeGreaterThanOrEqual(0);
      expect(c.level).toBeLessThanOrEqual(3);
    }
  });

  test('filter or pagination works if supported @category', async () => {
    const res = await categories.getCategories({ size: 1 });
    expect(res.status()).toBe(200);
    const body = await res.json();

    // If the API returns a paginated object we can assert page size.
    // If it returns a plain array that ignores `size`, accept it as supported-absent.
    if (!Array.isArray(body)) {
      expect(Array.isArray(body.results)).toBe(true);
      expect(body.results.length).toBeLessThanOrEqual(1);
    }

    // Try filtering by name using the first item
    const list = Array.isArray(body) ? body : body.results;
    const first = list[0];
    if (first && first.name) {
      const filterRes = await categories.getCategories({ name: first.name });
      expect(filterRes.status()).toBe(200);
      const filterBody = await filterRes.json();
      const filtered = Array.isArray(filterBody) ? filterBody : filterBody.results;
      expect(Array.isArray(filtered)).toBe(true);
      expect(filtered.some((x: any) => x.id === first.id)).toBe(true);
    }
  });
});
