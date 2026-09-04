import { apiRequest } from './client';

export type FlowUser = { id: string; email: string; username: string; displayName: string; role: string };
export type AuthResponse = { user: FlowUser; accessToken?: string };

export const authApi = {
  me: () => apiRequest<AuthResponse>({ path: '/api/v1/auth/me' }),
  login: (body: { email: string; password: string }) => apiRequest<AuthResponse>({ path: '/api/v1/auth/login', method: 'POST', body }),
  logout: () => apiRequest<{ ok: true }>({ path: '/api/v1/auth/logout', method: 'POST' }),
  refresh: () => apiRequest<AuthResponse>({ path: '/api/v1/auth/refresh', method: 'POST' }),
};

export const adminAuthApi = {
  me: () => apiRequest<AuthResponse>({ path: '/api/v1/admin/auth/me' }),
  login: (body: { email: string; password: string }) => apiRequest<AuthResponse>({ path: '/api/v1/admin/auth/login', method: 'POST', body }),
  logout: () => apiRequest<{ ok: true }>({ path: '/api/v1/admin/auth/logout', method: 'POST' }),
};
