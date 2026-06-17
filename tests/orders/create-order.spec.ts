import { test, expect } from '@playwright/test';
import { OrdersAPI } from '../../api/endpoints/orders';
import { getAuthToken } from '../../helpers/auth-helper';

test.describe('POST /api/orders/ @orders', () => {
  let orders: OrdersAPI;
  let token: string;

  test.beforeAll(async ({ request }) => {
    token = await getAuthToken(request);
  });

  test.beforeEach(({ request }) => {
    orders = new OrdersAPI(request);
  });

  test('create order without token returns 403 @orders', async () => {
    const res = await orders.createOrder('', {
      customer: 1,
      unit: 1,
      description: 'Test order description that is long enough to pass validation',
      start_date: '2026-07-01T09:00:00Z',
      end_date: '2026-07-10T18:00:00Z',
    });
    // NOTE: DRF returns 403 for unauthenticated requests
    expect(res.status()).toBe(403);
  });

  test('create order without required description returns 400 @orders', async () => {
    const res = await orders.createOrder(token, {
      customer: 1,
      unit: 1,
      start_date: '2026-07-01T09:00:00Z',
      end_date: '2026-07-10T18:00:00Z',
    });
    expect(res.status()).toBe(400);
  });

  test('create order with description shorter than 40 chars returns 400 @orders', async () => {
    const res = await orders.createOrder(token, {
      customer: 1,
      unit: 1,
      description: 'Too short',
      start_date: '2026-07-01T09:00:00Z',
      end_date: '2026-07-10T18:00:00Z',
    });
    expect(res.status()).toBe(400);
  });

  test('create order without start_date returns 400 @orders', async () => {
    const res = await orders.createOrder(token, {
      customer: 1,
      unit: 1,
      description: 'Test order description that is long enough to pass validation',
      end_date: '2026-07-10T18:00:00Z',
    });
    expect(res.status()).toBe(400);
  });

  test('create order without end_date returns 400 @orders', async () => {
    const res = await orders.createOrder(token, {
      customer: 1,
      unit: 1,
      description: 'Test order description that is long enough to pass validation',
      start_date: '2026-07-01T09:00:00Z',
    });
    expect(res.status()).toBe(400);
  });
});