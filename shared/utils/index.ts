import { isAxiosError } from 'axios';

export * from './masks';
export * from './datas';


export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    const apiError = error.response?.data?.error;
    if (typeof apiError === 'string' && apiError.trim()) return apiError;
    if (!error.response) return 'Não foi possível conectar ao servidor.';
  }
  return fallback;
}
