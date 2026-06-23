import { useQuery } from '@tanstack/react-query';
import { getEspecies, getPortes } from './api';

export function useEspecies() {
  return useQuery({
    queryKey: ['especies'],
    queryFn: getEspecies,
    staleTime: 1000 * 60 * 60,
  });
}

export function usePortes() {
  return useQuery({
    queryKey: ['portes'],
    queryFn: getPortes,
    staleTime: 1000 * 60 * 60,
  });
}
