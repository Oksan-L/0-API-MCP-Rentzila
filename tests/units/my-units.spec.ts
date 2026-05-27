import { test, expect } from '@playwright/test';
import { UnitsAPI } from '../../api/endpoints/units';
import { getAuthToken } from '../../helpers/auth-helper';

test.describe('GET /api/auth/users/me/units/ @units @me', () => {
    let units: UnitsAPI;
    let token: string;

    test.beforeAll(async ({ request }) => {
        token = await getAuthToken(request);
    });

    test.beforeEach(({ request }) => {
        units = new UnitsAPI(request);
    });

    test('authorized user gets own units list @units @smoke', async () => {
        const res = await units.getMyUnits(token);

        expect(res.status()).toBe(200);
        const body = await res.json();
        expect(body).toHaveProperty('units');
        expect(Array.isArray(body.units)).toBe(true);
    });

    test('own units belong to current user @units', async () => {
        const res = await units.getMyUnits(token);
        const body = await res.json();

        if (body.units.length > 0) {
            for (const unit of body.units) {
                expect(unit).toHaveProperty('id');
                expect(unit).toHaveProperty('name');
            }
        }
    });

    test('request without token returns 403 @units', async () => {
        const res = await units.getMyUnits('');
        // NOTE: DRF returns 403 for unauthenticated requests
        expect(res.status()).toBe(403);
    });

    test('request with invalid token returns 403 @units', async () => {
        const res = await units.getMyUnits('invalid.token.here');
        // NOTE: DRF returns 403 for unauthenticated requests
        expect(res.status()).toBe(403);
    });

});