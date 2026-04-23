import type { AdminCategoryPayload, ApiCategory } from '../types/api';
import { apiClient } from './apiClient';

export const categoryService = {
  listCategories: () => apiClient.get<ApiCategory[]>('/api/categories', { skipAuth: true }),
  getAdminCategories: () => apiClient.get<ApiCategory[]>('/api/admin/categories'),
  createAdminCategory: (payload: AdminCategoryPayload) =>
    apiClient.post<ApiCategory>('/api/admin/categories', payload),
  updateAdminCategory: (id: number, payload: AdminCategoryPayload) =>
    apiClient.put<ApiCategory>(`/api/admin/categories/${id}`, payload),
  deleteAdminCategory: (id: number) => apiClient.delete<void>(`/api/admin/categories/${id}`),
};
