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

// O AuthProvider registra aqui um callback para refletir o logout na UI
// quando o refresh falhar (sessão irrecuperável).
let onUnauthorized: (() => void) | null = null;

export function setOnUnauthorized(handler: (() => void) | null) {
  onUnauthorized = handler;
}

// Injeta o access token em cada requisição.
api.interceptors.request.use(async (config) => {
  const token = await getStoredToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

// Single-flight: garante uma única chamada /auth/refresh mesmo com várias
// requisições recebendo 401 em paralelo.
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = await getStoredRefreshToken();
  if (!refreshToken) {
    throw new Error('Sem refresh token armazenado');
  }

  // axios "cru" (sem interceptors) para não recursar no próprio refresh.
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

// Em 401: tenta renovar o token uma única vez e refaz a requisição original.
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;
    const status = error.response?.status;
    const url = original?.url ?? '';

    // Só tenta refresh em 401, uma vez por requisição, e nunca para os
    // próprios endpoints de auth (evita loop infinito).
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
