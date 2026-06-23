import { format, parseISO } from 'date-fns';


export function parseDataHora(iso: string): Date {
  return parseISO(iso);
}


export function formatData(iso: string): string {
  return format(parseDataHora(iso), 'dd/MM/yyyy');
}


export function formatHora(iso: string): string {
  return format(parseDataHora(iso), 'HH:mm');
}
