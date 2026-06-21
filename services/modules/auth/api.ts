import { api } from '@/services/api';
import { Login, LoginResponse } from '@/shared/types/auth';

export async function login(credentials: Login): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>(
    '/auth/login',
    credentials,
  );
  return data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

export async function refreshToken(token: string): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/refresh', {
    refreshToken: token,
  });
  return data;
}
