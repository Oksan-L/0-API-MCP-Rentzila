import { test, expect } from '@playwright/test';
import { UnitsAPI } from '../../api/endpoints/units';
import { AuthAPI } from '../../api/endpoints/auth';
import { getAuthToken } from '../../helpers/auth-helper';
import { createUnitPayload } from '../../helpers/data-factory';

test.describe.configure({ mode: 'serial' });

test.describe('PATCH /api/units/{id}/ and DELETE /api/units/{id}/ @units', () => {
  let units: UnitsAPI;
  let token: string;
  let userId: number;
  let unitId: number;

  test.beforeAll(async ({ request }) => {
    token = await getAuthToken(request);

    const auth = new AuthAPI(request);
    const profileRes = await auth.getProfile(token);
    const profile = await profileRes.json();
    userId = profile.id;

    // створюємо юніт для тестів
    const unitsApi = new UnitsAPI(request);
    const payload = createUnitPayload({ owner: userId });
    const createRes = await unitsApi.createUnit(token, payload);
    const created = await createRes.json();
    unitId = created.id;
  });

  test.beforeEach(({ request }) => {
    units = new UnitsAPI(request);
  });

  // PATCH
  test('authorized user can update unit name @units', async () => {
    const res = await units.updateUnit(token, unitId, {
      name: 'Updated excavator unit name',
    });

    expect(res.status()).toBe(202);
    const body = await res.json();
    expect(body.name).toBe('Updated excavator unit name');
  });

  test('update unit with name shorter than 10 chars returns 400 @units', async () => {
    const res = await units.updateUnit(token, unitId, { name: 'Short' });
    expect(res.status()).toBe(400);
  });

  test('update unit without token returns 403 @units', async () => {
    const res = await units.updateUnit('', unitId, { name: 'Updated name test' });
    // NOTE: DRF returns 403 for unauthenticated requests
    expect(res.status()).toBe(403);
  });

  test('update non-existent unit returns 404 @units', async () => {
    const res = await units.updateUnit(token, 999999999, { name: 'Updated name test' });
    // BUG: should return 404, but API returns 500 for non-existent unit
    expect(res.status()).toBe(404);
  });

  test('can update multiple fields at once @units', async () => {
    const res = await units.updateUnit(token, unitId, {
      name: 'Multi field update test',
      minimal_price: 2000,
      model_name: 'CAT330',
    });

    expect(res.status()).toBe(202);
    const body = await res.json();
    expect(body.name).toBe('Multi field update test');
    expect(body.minimal_price).toBe(2000);
    expect(body.model_name).toBe('CAT330');
  });

  // DELETE — останній бо видаляє юніт
  test('delete non-existent unit returns 404 @units', async () => {
    const res = await units.deleteUnit(token, 999999999);
    expect(res.status()).toBe(404);
  });

  test('delete unit without token returns 403 @units', async () => {
    const res = await units.deleteUnit('', unitId);
    // NOTE: DRF returns 403 for unauthenticated requests
    expect(res.status()).toBe(403);
  });

  test('authorized user can delete own unit @units', async () => {
    const res = await units.deleteUnit(token, unitId);
    expect(res.status()).toBe(204);
  });

  test('deleted unit is no longer accessible @units', async () => {
    const res = await units.getUnitById(unitId);
    // NOTE: API may return 200 with empty results instead of 404 (known bug)
    const body = await res.json();
    expect(body.id).toBeUndefined();
  });
});