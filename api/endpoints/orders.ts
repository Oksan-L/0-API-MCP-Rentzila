import { APIRequestContext } from '@playwright/test';

export class OrdersAPI {
  constructor(private request: APIRequestContext) { }

  async createOrder(token: string, data: Record<string, unknown>) {
    return this.request.post('/api/orders/', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      data,
    });
  }

  async getOrderById(token: string, id: number) {
    return this.request.get(`/api/order/${id}/`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  async approveOrDeclineOrder(token: string, id: number, data: { status: boolean; reason_rejected?: string }) {
    return this.request.post(`/api/order/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
      data,
    });
  }

  async patchOrder(token: string, id: number, data: Record<string, unknown>) {
    return this.request.patch(`/api/order/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
      data,
    });
  }

  async completeOrder(token: string, id: number, data: { job_completed: boolean; reason_rejected?: string }) {
    return this.request.post(`/api/order/${id}/complete/`, {
      headers: { Authorization: `Bearer ${token}` },
      data,
    });
  }

  async downloadOrderCalendar(token: string, id: number) {
    return this.request.get(`/api/order/${id}/calendar/download/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async getMyOrders(token: string) {
    return this.request.get('/api/auth/users/my/orders/', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  async getMyOrdersPending(token: string) {
    return this.request.get('/api/auth/users/my/orders/pending/', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  async getMyOrdersOnProgress(token: string) {
    return this.request.get('/api/auth/users/my/orders/onprogress/', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  async getMyOrdersCompleted(token: string) {
    return this.request.get('/api/auth/users/my/orders/completed/', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  // Order files
  async createOrderFile(token: string, orderId: number) {
    return this.request.post('/api/orders/file/', {
      headers: { Authorization: `Bearer ${token}` },
      data: { order: orderId },
    });
  }

  async getOrderFiles(token: string) {
    return this.request.get('/api/orders/file/', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async deleteOrderFile(token: string, fileId: number) {
    return this.request.delete(`/api/orders/file/${fileId}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async deleteOrder(token: string, id: number) {
    return this.request.delete(`/api/order/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}