import { test, expect } from '@playwright/test';
import { ReviewsAPI } from '../../api/endpoints/reviews';
import { getAuthToken } from '../../helpers/auth-helper';

test.describe('GET /api/reviews/ @reviews', () => {
    let reviews: ReviewsAPI;
    let token: string;

    test.beforeAll(async ({ request }) => {
        token = await getAuthToken(request);
    });

    test.beforeEach(({ request }) => {
        reviews = new ReviewsAPI(request);
    });

    test('authorized user gets own reviews list @reviews @smoke', async () => {
        const res = await reviews.getReviews(token);

        expect(res.status()).toBe(200);
        const body = await res.json();
        expect(body).toHaveProperty('count');
        expect(body).toHaveProperty('results');
        expect(Array.isArray(body.results)).toBe(true);
    });

    test('request without token returns 403 @reviews', async () => {
        const res = await reviews.getReviews('');
        // NOTE: returns 403 for unauthenticated requests
        expect(res.status()).toBe(403);
    });

    test('request with invalid token returns 403 @reviews', async () => {
        const res = await reviews.getReviews('invalid.token.here');
        // NOTE: returns 403 for unauthenticated requests
        expect(res.status()).toBe(403);
    });

    test('pagination works with page and size params @reviews', async () => {
        const res = await reviews.getReviews(token, { page: 1, size: 5 });

        expect(res.status()).toBe(200);
        const body = await res.json();
        expect(body.results.length).toBeLessThanOrEqual(5);
    });

    test('each review has required fields @reviews', async () => {
        const res = await reviews.getReviews(token, { size: 3 });
        const body = await res.json();

        for (const review of body.results) {
            expect(review).toHaveProperty('id');
            expect(review).toHaveProperty('value');
            expect(review).toHaveProperty('to_user');
            expect(review).toHaveProperty('order');
            expect(review.value).toBeGreaterThanOrEqual(1);
            expect(review.value).toBeLessThanOrEqual(5);
        }
    });

});