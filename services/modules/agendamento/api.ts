import { api } from '@/services/api';
import {
  Agendamento,
  AgendamentoPayload,
  HorarioSlot,
  Servico,
} from '@/shared/types/agendamento';

export const getServicos = async (): Promise<Servico[]> => {
  const response = await api.get('/servicos');
  return response.data;
};

export const getHorariosDisponiveis = async (
  data: string,
  servicoIds: number[],
): Promise<HorarioSlot[]> => {
  const response = await api.get('/agendamentos/horarios-disponiveis', {
    params: { data, servicoId: servicoIds },
  });
  return response.data;
};



export const getAgendamentos = async (): Promise<Agendamento[]> => {
  const response = await api.get('/agendamentos/meus');
  return response.data;
};

export const createAgendamento = async (
  payload: AgendamentoPayload,
): Promise<Agendamento> => {
  const response = await api.post('/agendamentos', payload);
  return response.data;
};
