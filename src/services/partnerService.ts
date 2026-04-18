import type { ApiBook, ApiOrder, PartnerBookRequest, PartnerRegisterPayload } from '../types/api';
import type { IncomeStat } from '../types/partner';
import { apiClient } from './apiClient';

/** Đăng ký cửa hàng — cần JWT độc giả đã đăng nhập */
export const partnerService = {
  registerStore: (payload: PartnerRegisterPayload) =>
    apiClient.post<unknown>('/api/partner/register', payload),

  getInventory: () => apiClient.get<ApiBook[]>('/api/partner/inventory'),

  getPartnerOrders: () => apiClient.get<ApiOrder[]>('/api/partner/orders'),

  getStats: () => apiClient.get<IncomeStat>('/api/partner/stats'),

  addBook: (payload: PartnerBookRequest) => apiClient.post<ApiBook>('/api/partner/books', payload),

  updateOrderStatus: (orderId: number, status: string) =>
    apiClient.put<ApiOrder>(`/api/partner/orders/${orderId}/status`, { status }),
};
