import { Tutor } from '@/shared/types/user';
import { api } from '../../api';

export async function getTutores(): Promise<Tutor[]> {
  const { data } = await api.get<Tutor[]>('/tutores');
  return data;
}

export async function saveTutor(tutor: Tutor): Promise<Tutor> {
  const { data } = await api.post<Tutor>('/tutores', tutor);
  return data;
}

export async function updateTutor(id: number, tutor: Tutor): Promise<Tutor> {
  const { data } = await api.put<Tutor>(`/tutores/${id}`, tutor);
  return data;
}

export async function deleteTutor(id: number): Promise<void> {
  await api.delete(`/tutores/${id}`);
}
