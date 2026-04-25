import { api } from '@/services/api';
import { Agendamento, AgendamentoPayload, Servico } from '@/shared/types/agendamento';

export const getServicos = async (): Promise<Servico[]> => {
  const response = await api.get('/servicos');
  return response.data;
};

export const getHorariosDisponiveis = async (
  data: string,
  servicoId: number
): Promise<string[]> => {
  const response = await api.get('/agendamentos/horarios-disponiveis', {
    params: { data, servicoId },
  });
  return response.data;
};

export const getAgendamentos = async (): Promise<Agendamento[]> => {
  const response = await api.get('/agendamentos');
  return response.data;
};

export const createAgendamento = async (payload: AgendamentoPayload): Promise<Agendamento> => {
  const response = await api.post('/agendamentos', payload);
  return response.data;
};
