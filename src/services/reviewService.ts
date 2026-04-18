import type { AdminReviewRow } from '../types/admin';
import { apiClient } from './apiClient';

export const reviewService = {
  getAdminReviews: () => apiClient.get<AdminReviewRow[]>('/api/admin/reviews'),
};
