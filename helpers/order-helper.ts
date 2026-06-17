import { APIRequestContext } from '@playwright/test';
import { OrdersAPI } from '../api/endpoints/orders';
import { getAuthToken } from './auth-helper';

const CUSTOMER_ID = parseInt(process.env.USER2_ID!);

// Counter to devide the dates within the same worker
let orderCounter = 0;

export function getFutureDates() {
  orderCounter++;
  const start = new Date();

  // move the start date 1 year into the future to avoid conflicts with existing orders in the system
  start.setFullYear(start.getFullYear() + 1);

  // Take the remainder of the current timestamp (unique for each second)
  // and add the test counter. The offset will always be between 1 and 500 days.
  const uniqueOffset = (Math.floor(Date.now() / 1000) % 400) + orderCounter;

  start.setDate(start.getDate() + uniqueOffset);

  const end = new Date(start);
  end.setDate(end.getDate() + 1); // Booking for 1 day

  return {
    start_date: start.toISOString(),
    end_date: end.toISOString(),
  };
}

export async function getAvailableUnitId(request: APIRequestContext): Promise<number> {
  const res = await request.get('/api/units/', { params: { size: 100 } });
  const body = await res.json();
  const units = body.results ?? body;

  if (!units || units.length === 0) {
    throw new Error('No units available in the system to create a test order');
  }

  const currentUserId = parseInt(process.env.USER2_ID! || '1782');

  const available = units.find((u: any) => {
    return u.owner !== currentUserId && !u.is_archived && u.is_approved === true;
  });

  if (!available) {
    throw new Error(`Could not find an active approved third-party unit for user ID=${currentUserId}.`);
  }

  return available.id;
}

export async function createTestOrder(request: APIRequestContext) {
  const token = await getAuthToken(request, 'user2'); // Token of the customer
  const ownerToken = await getAuthToken(request, 'user1'); // Token of the unit owner for approve/decline

  const unitId = await getAvailableUnitId(request);
  const orders = new OrdersAPI(request);
  const { start_date, end_date } = getFutureDates();

  const res = await orders.createOrder(token, {
    customer: CUSTOMER_ID,
    unit: unitId,
    description: 'Test order description that is long enough for testing purposes',
    start_date,
    end_date,
  });

  const text = await res.text();

  if (res.status() !== 201) {
    console.error(`🚨 SERVER RETURNED ERROR ${res.status()}! Text of the response:`);
    console.error(text);
    throw new Error(`Failed to create test order: status=${res.status()} unitId=${unitId}`);
  }

  const body = JSON.parse(text);
  return {
    id: body.id,
    token,       // Token of the customer (USER2)
    ownerToken,  // Token of the unit owner (USER1)
    ...body,
  };
}