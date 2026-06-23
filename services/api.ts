import {
  clearSession,
  getStoredRefreshToken,
  getStoredToken,
  setStoredRefreshToken,
  setStoredToken,
} from '@/services/modules/auth/storage';
import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios';

const baseURL = process.env.EXPO_PUBLIC_API_URL;

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});





let onUnauthorized: (() => void) | null = null;

export function setOnUnauthorized(handler: (() => void) | null) {
  onUnauthorized = handler;
}



api.interceptors.request.use(async (config) => {
  const token = await getStoredToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };





let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = await getStoredRefreshToken();
  if (!refreshToken) {
    throw new Error('Sem refresh token armazenado');
  }

  

  const { data } = await axios.post(`${baseURL}/auth/refresh`, {
    refreshToken,
  });

  await setStoredToken(data.accessToken);
  await setStoredRefreshToken(data.refreshToken);
  return data.accessToken;
}

async function handleAuthFailure(): Promise<void> {
  await clearSession();
  onUnauthorized?.();
}



api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;
    const status = error.response?.status;
    const url = original?.url ?? '';

    

    

    if (status !== 401 || !original || original._retry || url.includes('/auth/')) {
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      refreshPromise = refreshPromise ?? refreshAccessToken();
      const newToken = await refreshPromise;
      refreshPromise = null;

      if (original.headers) {
        original.headers.Authorization = `Bearer ${newToken}`;
      }
      return api(original);
    } catch (refreshError) {
      refreshPromise = null;
      await handleAuthFailure();
      return Promise.reject(refreshError);
    }
  },
);
