export type HorarioSlot = {
  hora: string;
  disponivel: boolean;
};

export type Servico = {
  id: number;
  nome: string;
  descricao?: string;
  preco?: number;
  duracaoMinutos?: number;
};

export type AgendamentoPayload = {
  dataHora: string; 

  pet: { id: number };
  servicos: { id: number }[];
};

export type Agendamento = {
  id: number;
  dataHora: string;
  status?: string;
  pet: { id: number };
  servicos: Servico[];
};
