import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'auth_token';
const REFRESH_KEY = 'auth_refresh_token';

const isWeb = Platform.OS === 'web';

async function getItem(key: string): Promise<string | null> {
  if (isWeb) {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
}

async function setItem(key: string, value: string): Promise<void> {
  if (isWeb) {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function removeItem(key: string): Promise<void> {
  if (isWeb) {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

// ----- Access token -----
export function getStoredToken(): Promise<string | null> {
  return getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): Promise<void> {
  return setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): Promise<void> {
  return removeItem(TOKEN_KEY);
}

// ----- Refresh token -----
export function getStoredRefreshToken(): Promise<string | null> {
  return getItem(REFRESH_KEY);
}

export function setStoredRefreshToken(token: string): Promise<void> {
  return setItem(REFRESH_KEY, token);
}

export function clearStoredRefreshToken(): Promise<void> {
  return removeItem(REFRESH_KEY);
}

// Limpa toda a sessão (access + refresh) de uma vez.
export async function clearSession(): Promise<void> {
  await Promise.all([clearStoredToken(), clearStoredRefreshToken()]);
}
