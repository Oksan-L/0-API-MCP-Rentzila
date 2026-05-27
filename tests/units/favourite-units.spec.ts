import { test, expect } from '@playwright/test';
import { UnitsAPI } from '../../api/endpoints/units';
import { AuthAPI } from '../../api/endpoints/auth';
import { getAuthToken } from '../../helpers/auth-helper';
import { createUnitPayload } from '../../helpers/data-factory';

test.describe.configure({ mode: 'serial' });

test.describe('Favourite units @units @favourites', () => {
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

        // створюємо власний юніт щоб не конфліктувати з іншими тестами
        const unitsApi = new UnitsAPI(request);
        const payload = createUnitPayload({ owner: userId });
        const createRes = await unitsApi.createUnit(token, payload);
        const created = await createRes.json();
        unitId = created.id;
    });

    test.afterAll(async ({ request }) => {
        const unitsApi = new UnitsAPI(request);
        await unitsApi.deleteUnit(token, unitId);
    });

    test.beforeEach(({ request }) => {
        units = new UnitsAPI(request);
    });

    // GET favourites
    test('GET /auth/users/{id}/favourite-units/ returns list @units @smoke', async () => {
        const res = await units.getFavouriteUnits(token, userId);

        expect(res.status()).toBe(200);
        const body = await res.json();
        expect(body).toHaveProperty('units');
        expect(Array.isArray(body.units)).toBe(true);
    });

    test('GET favourite units without token returns 403 @units', async () => {
        const res = await units.getFavouriteUnits('', userId);
        expect(res.status()).toBe(403);
    });

    // POST — add to favourites
    test('POST adds unit to favourites @units @favourites', async () => {
        const res = await units.addFavouriteUnit(token, userId, unitId);
        expect(res.status()).toBe(201);

        await units.removeFavouriteUnit(token, userId, unitId);
    });

    test('POST add favourite without token returns 403 @units', async () => {
        const res = await units.addFavouriteUnit('', userId, unitId);
        expect(res.status()).toBe(403);
    });

    // DELETE — remove from favourites
    test('DELETE removes unit from favourites @units @favourites', async () => {
        // спочатку додаємо
        await units.addFavouriteUnit(token, userId, unitId);

        const res = await units.removeFavouriteUnit(token, userId, unitId);
        expect(res.status()).toBe(204);
    });

    test('DELETE favourite without token returns 403 @units', async () => {
        const res = await units.removeFavouriteUnit('', userId, unitId);
        expect(res.status()).toBe(403);
    });

    // full flow
    test('add unit to favourites then verify it appears in list @units @favourites', async () => {
        await units.addFavouriteUnit(token, userId, unitId);

        const res = await units.getFavouriteUnits(token, userId);
        const body = await res.json();

        const found = body.units.some((u: { id: number }) => u.id === unitId);
        expect(found).toBe(true);

        await units.removeFavouriteUnit(token, userId, unitId);
    });
});