import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as tutorApi from './api';
import { Tutor } from '@/shared/types/user';

export function useTutores() {
  return useQuery({
    queryKey: ['tutores'],
    queryFn: tutorApi.getTutores,
  });
}

export function useCreateTutor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tutorApi.saveTutor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutores'] });
    },
  });
}

export function useUpdateTutor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, tutor }: { id: number; tutor: Tutor }) =>
      tutorApi.updateTutor(id, tutor),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutores'] });
    },
  });
}

export function useDeleteTutor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tutorApi.deleteTutor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutores'] });
    },
  });
}
