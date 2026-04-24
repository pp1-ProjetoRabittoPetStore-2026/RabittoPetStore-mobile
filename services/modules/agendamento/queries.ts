import { useMutation, useQuery } from '@tanstack/react-query';
import { AgendamentoPayload } from '@/shared/types/agendamento';
import { createAgendamento, getServicos } from './api';

export function useServicos() {
  return useQuery({
    queryKey: ['servicos'],
    queryFn: getServicos,
  });
}

export function useCreateAgendamento() {
  return useMutation({
    mutationFn: (payload: AgendamentoPayload) => createAgendamento(payload),
  });
}
