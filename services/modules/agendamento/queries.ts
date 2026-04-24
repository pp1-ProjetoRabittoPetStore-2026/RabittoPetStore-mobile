import { useMutation, useQuery } from '@tanstack/react-query';
import { AgendamentoPayload } from '@/shared/types/agendamento';
import { createAgendamento, getHorariosDisponiveis, getServicos } from './api';

export function useServicos() {
  return useQuery({
    queryKey: ['servicos'],
    queryFn: getServicos,
  });
}

export function useHorariosDisponiveis(data: string, servicoId: number | null) {
  return useQuery({
    queryKey: ['horarios-disponiveis', data, servicoId],
    queryFn: () => getHorariosDisponiveis(data, servicoId!),
    enabled: Boolean(data && servicoId),
  });
}

export function useCreateAgendamento() {
  return useMutation({
    mutationFn: (payload: AgendamentoPayload) => createAgendamento(payload),
  });
}

