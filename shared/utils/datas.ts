import { format, parseISO } from 'date-fns';

/**
 * O backend envia `dataHora` como LocalDateTime ISO sem offset
 * (ex: "2026-06-22T14:00:00") — é hora de parede, sem fuso.
 *
 * `parseISO` interpreta o valor como horário local e devolve um Date
 * com os mesmos componentes (dia/hora) que o backend salvou, de forma
 * determinística em qualquer engine (Hermes incluso). Já `new Date(iso)`
 * tem parsing dependente de engine/fuso e pode deslocar o horário.
 */
export function parseDataHora(iso: string): Date {
  return parseISO(iso);
}

/** Formata a data do agendamento como "dd/MM/aaaa", independente do fuso. */
export function formatData(iso: string): string {
  return format(parseDataHora(iso), 'dd/MM/yyyy');
}

/** Formata o horário do agendamento como "HH:mm", independente do fuso. */
export function formatHora(iso: string): string {
  return format(parseDataHora(iso), 'HH:mm');
}
