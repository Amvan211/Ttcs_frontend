import axios, { AxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../config/api';

const AUTH_KEY = 'auth_data';

export function getAuthToken(): string | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const j = JSON.parse(raw) as { token?: string };
    return j.token ?? null;
  } catch {
    return null;
  }
}

function parseError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data && typeof data === 'object') {
      const msg = (data as any).message || (data as any).error;
      if (msg) return msg;
    }
    if (error.response?.statusText) return error.response.statusText;
    return error.message;
  }
  return String(error);
}

export async function apiRequest<T>(
  method: string,
  path: string,
  options?: { body?: unknown; skipAuth?: boolean }
): Promise<T> {
  const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  
  const config: AxiosRequestConfig = {
    method,
    url,
    headers: {}
  };

  if (options?.body !== undefined && options?.body !== null) {
    config.data = options.body;
    config.headers!['Content-Type'] = 'application/json';
  }

  if (!options?.skipAuth) {
    const token = getAuthToken();
    if (token) {
      config.headers!['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const response = await axios.request<T>(config);
    return response.data;
  } catch (error) {
    throw new Error(parseError(error));
  }
}

export const apiClient = {
  get: <T>(path: string, opts?: { skipAuth?: boolean }) =>
    apiRequest<T>('GET', path, { skipAuth: opts?.skipAuth }),
  post: <T>(path: string, body?: unknown, opts?: { skipAuth?: boolean }) =>
    apiRequest<T>('POST', path, { body, skipAuth: opts?.skipAuth }),
  put: <T>(path: string, body?: unknown, opts?: { skipAuth?: boolean }) =>
    apiRequest<T>('PUT', path, { body, skipAuth: opts?.skipAuth }),
  delete: <T>(path: string, opts?: { skipAuth?: boolean }) =>
    apiRequest<T>('DELETE', path, { skipAuth: opts?.skipAuth }),
};
