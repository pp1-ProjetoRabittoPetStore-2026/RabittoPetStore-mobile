import { isAxiosError } from 'axios';

export * from './masks';

/**
 * Extrai a mensagem de erro padronizada do backend ({ error: string }).
 * Faz fallback para uma mensagem amigável quando o erro não tem corpo
 * conhecido (ex: falha de rede ou erro inesperado).
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    const apiError = error.response?.data?.error;
    if (typeof apiError === 'string' && apiError.trim()) return apiError;
    if (!error.response) return 'Não foi possível conectar ao servidor.';
  }
  return fallback;
}
