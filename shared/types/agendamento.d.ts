export type Servico = {
  id: number;
  nome: string;
  descricao?: string;
  preco?: number;
};

export type AgendamentoPayload = {
  dataHora: string; // ISO 8601
  pet: { id: number };
  servico: { id: number };
};

export type Agendamento = {
  id: number;
  dataHora: string;
  pet: { id: number };
  servico: Servico;
};
