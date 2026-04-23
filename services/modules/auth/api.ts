import { api } from '@/services/api';
import { Login } from '@/shared/types/auth';

export async function login(credentials: Login): Promise<{ token: string }> {
  const { data } = await api.post<{ token: string }>(
    '/auth/login',
    credentials,
  );
  return data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

export async function refreshToken(): Promise<{ token: string }> {
  const { data } = await api.post<{ token: string }>('/auth/refresh');
  return data;
}
