import { api } from '@/services/api';
import { Tutor } from '@/shared/types/user';

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

// Perfil do próprio tutor logado (resolvido pelo JWT no backend)
export async function getMyProfile(): Promise<Tutor> {
  const { data } = await api.get<Tutor>('/tutores/me');
  return data;
}

export async function updateMyProfile(tutor: Tutor): Promise<Tutor> {
  const { data } = await api.put<Tutor>('/tutores/me', tutor);
  return data;
}

export async function deleteTutor(id: number): Promise<void> {
  await api.delete(`/tutores/${id}`);
}
