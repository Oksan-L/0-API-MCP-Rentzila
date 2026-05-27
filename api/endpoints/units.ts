import { APIRequestContext } from '@playwright/test';

export class UnitsAPI {
  constructor(private request: APIRequestContext) { }

  async getUnits(params?: Record<string, string | number>) {
    return this.request.get('/api/units/', { params });
  }

  async getUnitById(id: number) {
    return this.request.get(`/api/units/${id}/`);
  }

  async createUnit(token: string, data: Record<string, unknown>) {
    return this.request.post('/api/units/', {
      headers: { Authorization: `Bearer ${token}` },
      data,
    });
  }

  async updateUnit(token: string, id: number, data: Record<string, unknown>) {
    return this.request.patch(`/api/units/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
      data,
    });
  }

  async deleteUnit(token: string, id: number) {
    return this.request.delete(`/api/units/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async getMyUnits(token: string) {
    return this.request.get('/api/auth/users/me/units/', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async getFavouriteUnits(token: string, userId: number) {
    return this.request.get(`/api/auth/users/${userId}/favourite-units/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async addFavouriteUnit(token: string, userId: number, unitId: number) {
    return this.request.post(`/api/auth/users/${userId}/favourite-units/${unitId}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async removeFavouriteUnit(token: string, userId: number, unitId: number) {
    return this.request.delete(`/api/auth/users/${userId}/favourite-units/${unitId}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}