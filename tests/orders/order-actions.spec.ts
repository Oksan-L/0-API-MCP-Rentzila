import { test, expect } from '@playwright/test';
import { OrdersAPI } from '../../api/endpoints/orders';
import { createTestOrder } from '../../helpers/order-helper';

// test.describe.configure({ mode: 'serial' }); 
// npx playwright test tests/orders/order-actions.spec.ts --workers=1

test.describe('GET /api/order/{id}/ @orders', () => {
    let orders: OrdersAPI;
    let testOrder: any;

    test.beforeEach(async ({ request }) => {
        orders = new OrdersAPI(request);
        testOrder = await createTestOrder(request);
    });

    test.afterEach(async () => {
        if (testOrder && testOrder.id) {
            // Instead of DELETE just mark as cancelled by the owner
            await orders.approveOrDeclineOrder(testOrder.ownerToken, testOrder.id, {
                status: false,
                reason_rejected: 'Cleanup after test',
            });
        }
    });

    test('get order by id returns 200 @orders @smoke', async () => {
        const res = await orders.getOrderById(testOrder.token, testOrder.id);
        expect(res.status()).toBe(200);
    });

    test('order response data matches created order @orders', async () => {
        const res = await orders.getOrderById(testOrder.token, testOrder.id);
        const body = await res.json();
        expect(body.id).toBe(testOrder.id);
    });

    test('order response has expected fields @orders', async () => {
        const res = await orders.getOrderById(testOrder.token, testOrder.id);
        const body = await res.json();
        expect(body).toHaveProperty('id');
        expect(body).toHaveProperty('customer');
        expect(body).toHaveProperty('unit');
        expect(body).toHaveProperty('description');
        expect(body).toHaveProperty('start_date');
        expect(body).toHaveProperty('end_date');
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('is_closed');
    });

    test('get non-existent order returns 404 @orders', async () => {
        const res = await orders.getOrderById(testOrder.token, 999999999);
        expect(res.status()).toBe(404);
    });

    test('get order without token returns 401 or 403 @orders', async () => {
        const res = await orders.getOrderById('', testOrder.id);
        expect([401, 403]).toContain(res.status());
    });
});

test.describe('POST /api/order/{id}/ approve/decline @orders', () => {
    let orders: OrdersAPI;
    let testOrder: any;

    test.beforeEach(async ({ request }) => {
        orders = new OrdersAPI(request);
        testOrder = await createTestOrder(request);
    });

    test('decline order with reason returns 202 @orders', async () => {
        // ownerToken performs the action 
        const res = await orders.approveOrDeclineOrder(testOrder.ownerToken, testOrder.id, {
            status: false,
            reason_rejected: 'Unit unavailable during this period',
        });
        expect(res.status()).toBe(202);
    });

    test('decline without token returns 401 or 403 @orders', async () => {
        // leave the token empty to test unauthorized request
        const res = await orders.approveOrDeclineOrder('', testOrder.id, {
            status: false,
            reason_rejected: 'Test',
        });
        expect([401, 403]).toContain(res.status());
    });

    test('decline response has expected fields @orders', async () => {
        // ownerToken performs the action
        const res = await orders.approveOrDeclineOrder(testOrder.ownerToken, testOrder.id, {
            status: false,
            reason_rejected: 'Test reason for rejection',
        });
        const body = await res.json();
        expect(body).toHaveProperty('id');
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('reason_rejected');
    });
});