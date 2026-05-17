import { apiClient } from './apiClient';
import type { ApiVoucher } from '../types/voucher';

export const voucherService = {
  getMyVouchers: () => apiClient.get<ApiVoucher[]>('/api/vouchers/me'),
};
