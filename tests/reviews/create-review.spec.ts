import { test, expect } from '@playwright/test';
import { ReviewsAPI } from '../../api/endpoints/reviews';
import { getAuthToken } from '../../helpers/auth-helper';

test.describe('POST /api/reviews/ @reviews', () => {
  let reviews: ReviewsAPI;
  let token: string;

  test.beforeAll(async ({ request }) => {
    token = await getAuthToken(request);
  });

  test.beforeEach(({ request }) => {
    reviews = new ReviewsAPI(request);
  });

  // Happy path — requires real order id in .env
  test.skip('authorized user can create a review @reviews @smoke', async () => {
    // requires TEST_ORDER_ID and TEST_REVIEW_TO_USER_ID in .env
    // skip if not configured
    const orderId = process.env.TEST_ORDER_ID;
    const toUserId = process.env.TEST_REVIEW_TO_USER_ID;

    if (!orderId || !toUserId) {
      test.skip(true, 'TEST_ORDER_ID or TEST_REVIEW_TO_USER_ID not set in .env');
    }

    const res = await reviews.createReview(token, {
      text: 'Great service, highly recommend this equipment rental.',
      value: 5,
      to_user: Number(toUserId),
      order: Number(orderId),
    });

    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body).toHaveProperty('id');
    expect(body.value).toBe(5);
    expect(body).toHaveProperty('author');
    expect(body).toHaveProperty('created_date');
  });

  // Negative test cases
  // Skip tests with "order: 1" because we don`t have a test order 
  test('create review without token returns 403 @reviews', async () => { // it`s ok even without a valid order, because request should be rejected before validating order id
    const res = await reviews.createReview('', {
      text: 'Test review',
      value: 5,
      to_user: 1,
      order: 1,
    });
    // NOTE: returns 403 for unauthenticated requests
    expect(res.status()).toBe(403);
  });

  test.skip('create review with value out of range returns 400 @reviews', async () => {
    const res = await reviews.createReview(token, {
      text: 'Test review',
      value: 6, // max is 5
      to_user: 1,
      order: 1,
    });
    expect(res.status()).toBe(400);
  });

  test.skip('create review with value below minimum returns 400 @reviews', async () => {
    const res = await reviews.createReview(token, {
      text: 'Test review',
      value: 0, // min is 1
      to_user: 1,
      order: 1,
    });
    expect(res.status()).toBe(400);
  });

  test.skip('create review without required to_user returns 400 @reviews', async () => {
    const res = await reviews.createReview(token, {
      text: 'Test review',
      value: 5,
      order: 1,
    });
    expect(res.status()).toBe(400);
  });

  test('create review without required order returns 400 @reviews', async () => {
    const res = await reviews.createReview(token, {
      text: 'Test review',
      value: 5,
      to_user: 1,
    });
    expect(res.status()).toBe(400);
  });

  test.skip('create review with text exceeding 2000 chars returns 400 @reviews', async () => {
    const res = await reviews.createReview(token, {
      text: 'a'.repeat(2001),
      value: 5,
      to_user: 1,
      order: 1,
    });
    expect(res.status()).toBe(400);
  });
});