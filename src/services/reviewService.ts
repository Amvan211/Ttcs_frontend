import type { AdminReviewRow } from '../types/admin';
import { apiClient } from './apiClient';

export const reviewService = {
  getAdminReviews: () => apiClient.get<AdminReviewRow[]>('/api/admin/reviews'),
  deleteAdminReview: (id: number) => apiClient.delete<void>(`/api/admin/reviews/${id}`),
  getReviews: (bookId: number) => apiClient.get<any[]>(`/api/books/${bookId}/reviews`),
  addReview: (bookId: number, rating: number, comment: string) => 
    apiClient.post<any>(`/api/books/${bookId}/reviews`, { rating, comment }),
};
