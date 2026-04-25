import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AgendamentoPayload } from '@/shared/types/agendamento';
import { createAgendamento, getAgendamentos, getHorariosDisponiveis, getServicos } from './api';


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

export function useAgendamentosByPet(petId: number | undefined) {
  return useQuery({
    queryKey: ['agendamentos', petId],
    queryFn: async () => {
      const all = await getAgendamentos();
      return all.filter((a) => a.pet.id === petId);
    },
    enabled: petId != null,
  });
}

export function useCreateAgendamento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AgendamentoPayload) => createAgendamento(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
    },
  });
}

