import { test, expect } from '@playwright/test';
import { OrdersAPI } from '../../api/endpoints/orders';
import { getAuthToken } from '../../helpers/auth-helper';

test.describe('GET /api/auth/users/my/orders/ @orders @me', () => {
  let orders: OrdersAPI;
  let token: string;

  test.beforeAll(async ({ request }) => {
    token = await getAuthToken(request);
  });

  test.beforeEach(({ request }) => {
    orders = new OrdersAPI(request);
  });

  test('authorized user gets own orders list @orders @smoke', async () => {
    const res = await orders.getMyOrders(token);

    expect(res.status()).toBe(200);
  });

  test('request without token returns 403 @orders', async () => {
    const res = await orders.getMyOrders('');
    // NOTE: DRF returns 403 for unauthenticated requests
    expect(res.status()).toBe(403);
  });

  test('pending orders endpoint returns 200 @orders', async () => {
    const res = await orders.getMyOrdersPending(token);
    expect(res.status()).toBe(200);
  });

  test('onprogress orders endpoint returns 200 @orders', async () => {
    const res = await orders.getMyOrdersOnProgress(token);
    expect(res.status()).toBe(200);
  });

  test('completed orders endpoint returns 200 @orders', async () => {
    const res = await orders.getMyOrdersCompleted(token);
    expect(res.status()).toBe(200);
  });

  test('pending orders without token returns 403 @orders', async () => {
    const res = await orders.getMyOrdersPending('');
    expect(res.status()).toBe(403);
  });
});