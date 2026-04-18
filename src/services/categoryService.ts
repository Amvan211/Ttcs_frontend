import type { ApiCategory } from '../types/api';
import { apiClient } from './apiClient';

export const categoryService = {
  listCategories: () => apiClient.get<ApiCategory[]>('/api/categories', { skipAuth: true }),
};
