import type { AdminBookPayload, ApiBook, ApiBookDetail } from '../types/api';
import { apiClient } from './apiClient';

export interface BookSearchParams {
  title?: string;
  author?: string;
  categoryId?: number;
  category?: string;
}

export const bookService = {
  searchBooks: (params?: BookSearchParams) => {
    const q = new URLSearchParams();
    if (params?.title) q.set('title', params.title);
    if (params?.author) q.set('author', params.author);
    if (params?.categoryId != null) q.set('categoryId', String(params.categoryId));
    if (params?.category) q.set('category', params.category);
    const suffix = q.toString() ? `?${q.toString()}` : '';
    return apiClient.get<ApiBook[]>(`/api/books${suffix}`);
  },

  getBookDetail: (id: number) => apiClient.get<ApiBookDetail>(`/api/books/${id}`),

  getAdminBooks: () => apiClient.get<ApiBook[]>('/api/admin/books'),
  getPendingBooks: () => apiClient.get<ApiBook[]>('/api/admin/books/pending'),
  createAdminBook: (payload: AdminBookPayload) => apiClient.post<ApiBook>('/api/admin/books', payload),
  updateAdminBook: (id: number, payload: Partial<AdminBookPayload>) =>
    apiClient.put<ApiBook>(`/api/admin/books/${id}`, payload),
  deleteAdminBook: (id: number) => apiClient.delete<void>(`/api/admin/books/${id}`),
};
