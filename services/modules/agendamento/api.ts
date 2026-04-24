import { api } from '@/services/api';
import { Agendamento, AgendamentoPayload, Servico } from '@/shared/types/agendamento';

export const getServicos = async (): Promise<Servico[]> => {
  const response = await api.get('/servicos');
  return response.data;
};

export const createAgendamento = async (payload: AgendamentoPayload): Promise<Agendamento> => {
  const response = await api.post('/agendamentos', payload);
  return response.data;
};
