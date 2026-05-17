import type { AdminOrderPayload, ApiOrder, CreateOrderPayload } from '../types/api';
import type { AdminOrderRow } from '../types/admin';
import { apiClient } from './apiClient';

export const orderService = {
  getHistory: () => apiClient.get<ApiOrder[]>('/api/orders/history'),

  createOrder: (payload: CreateOrderPayload) =>
    apiClient.post<ApiOrder>('/api/orders', payload),

  checkPurchase: (bookId: number) => 
    apiClient.get<{ canReview: boolean }>(`/api/orders/check-purchase?bookId=${bookId}`),

  getAdminOrders: () => apiClient.get<AdminOrderRow[]>('/api/admin/orders'),
  createAdminOrder: (payload: AdminOrderPayload) => apiClient.post<ApiOrder>('/api/admin/orders', payload),
  updateAdminOrder: (id: number, payload: Partial<AdminOrderPayload>) =>
    apiClient.put<ApiOrder>(`/api/admin/orders/${id}`, payload),
  deleteAdminOrder: (id: number) => apiClient.delete<void>(`/api/admin/orders/${id}`),
};
