export type Servico = {
  id: number;
  nome: string;
  descricao?: string;
  preco?: number;
};

export type AgendamentoPayload = {
  dataHora: string; // ISO 8601
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
