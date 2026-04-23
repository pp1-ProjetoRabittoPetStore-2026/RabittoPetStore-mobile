import { Login } from '@/shared/types/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as authApi from './api';

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: Login) => authApi.login(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}

export function useRefreshToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.refreshToken,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}
