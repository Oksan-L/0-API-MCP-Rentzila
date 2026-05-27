import { test, expect } from '@playwright/test';
import { UnitsAPI } from '../../api/endpoints/units';

test.describe('GET /api/units/ @units @smoke', () => {
  let units: UnitsAPI;

  test.beforeEach(({ request }) => {
    units = new UnitsAPI(request);
  });

  test('returns paginated list of units @units @smoke', async () => {
    const res = await units.getUnits();

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('count');
    expect(body).toHaveProperty('results');
    expect(Array.isArray(body.results)).toBe(true);
  });

  test('pagination works with page and size params @units', async () => {
    const res = await units.getUnits({ page: 1, size: 5 });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.results.length).toBeLessThanOrEqual(5);
  });

  test('filter by name returns matching results @units', async () => {
    const res = await units.getUnits({ name: 'екскаватор' });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('results');
  });

  test('each unit in list has required fields @units', async () => {
    const res = await units.getUnits({ size: 3 });
    const body = await res.json();

    for (const unit of body.results) {
      expect(unit).toHaveProperty('id');
      expect(unit).toHaveProperty('name');
      expect(typeof unit.id).toBe('number');
      expect(typeof unit.name).toBe('string');
    }
  });
});

test.describe('GET /api/units/{id}/ @units @smoke', () => {
  let units: UnitsAPI;

  test.beforeEach(({ request }) => {
    units = new UnitsAPI(request);
  });

  test('returns unit by valid id @units @smoke', async () => {
    // start by getting the first id from the list
    const listRes = await units.getUnits({ size: 1 });
    const listBody = await listRes.json();
    const firstId = listBody.results[0]?.id;

    const res = await units.getUnitById(firstId);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.id).toBe(firstId);
    expect(body).toHaveProperty('name');
    expect(body).toHaveProperty('category');
    expect(body).toHaveProperty('price');
  });

  test('non-existent id returns 404 @units', async () => {
    const res = await units.getUnitById(99999999999999);
    // should return 404, but API returns 200
    expect(res.status()).toBe(404);
  });


  // test('debug - check enum values from existing unit', async () => {
  //   const listRes = await units.getUnits({ size: 1 });
  //   const listBody = await listRes.json();
  //   const firstId = listBody.results[0]?.id;

  //   const res = await units.getUnitById(firstId);
  //   const body = await res.json();
  //   console.log({
  //     type_of_work: body.type_of_work,
  //     time_of_work: body.time_of_work,
  //     payment_method: body.payment_method,
  //     money_value: body.money_value,
  //   });
  //   console.log({
  //     category: body.category,
  //     services: body.services,
  //   });
  // });

});