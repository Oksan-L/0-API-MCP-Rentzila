import { test, expect } from '@playwright/test';
import { UnitsAPI } from '../../api/endpoints/units';
import { AuthAPI } from '../../api/endpoints/auth';
import { getAuthToken } from '../../helpers/auth-helper';
import { createUnitPayload } from '../../helpers/data-factory';

test.describe('POST /api/units/ @units', () => {
  let units: UnitsAPI;
  let token: string;
  let userId: number;
  const createdUnitIds: number[] = [];

  test.beforeAll(async ({ request }) => {
    token = await getAuthToken(request);
    // отримуємо id поточного юзера для поля owner
    const auth = new AuthAPI(request);
    const profileRes = await auth.getProfile(token);
    const profile = await profileRes.json();
    userId = profile.id;
  });

  test.beforeEach(({ request }) => {
    units = new UnitsAPI(request);
  });

  // cleanup — видаляємо всі створені юніти після тестів
  test.afterAll(async ({ request }) => {
    const unitsApi = new UnitsAPI(request);
    for (const id of createdUnitIds) {
      await unitsApi.deleteUnit(token, id);
    }
  });

  test('authorized user can create a unit @units', async () => {
    const payload = createUnitPayload({ owner: userId });
    const res = await units.createUnit(token, payload);

    // console.log(res.status(), await res.json());
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body).toHaveProperty('id');
    expect(body.name).toBe(payload.name);
    createdUnitIds.push(body.id); // запам'ятовуємо для cleanup
  });

  test('create unit without token returns 403 @units', async () => {
    const payload = createUnitPayload({ owner: userId });
    const res = await units.createUnit('', payload);
    // NOTE: DRF returns 403 for unauthenticated requests
    expect(res.status()).toBe(403);
  });

  test('create unit without required name returns 400 @units', async () => {
    const payload = createUnitPayload({ owner: userId, name: undefined });
    const res = await units.createUnit(token, payload);
    expect(res.status()).toBe(400);
  });

  test('create unit with name shorter than 10 chars returns 400 @units', async () => {
    const payload = createUnitPayload({ owner: userId, name: 'Short' });
    const res = await units.createUnit(token, payload);
    expect(res.status()).toBe(400);
  });
});