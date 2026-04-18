import type { ApiOrder, CreateOrderPayload } from '../types/api';
import type { AdminOrderRow } from '../types/admin';
import { apiClient } from './apiClient';

export const orderService = {
  getHistory: () => apiClient.get<ApiOrder[]>('/api/orders/history'),

  createOrder: (payload: CreateOrderPayload) =>
    apiClient.post<ApiOrder>('/api/orders', payload),

  getAdminOrders: () => apiClient.get<AdminOrderRow[]>('/api/admin/orders'),
};
