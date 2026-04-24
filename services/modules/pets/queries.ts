import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Pet } from '@/shared/types/pet';

export function useCreatePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newPet: Pet) => api.post('/pets', newPet),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
    },
  });
}

export function useUpdatePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updatedPet }: { id: string; updatedPet: Pet }) =>
      api.put(`/pets/${id}`, updatedPet),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
    },
  });
}

export function useDeletePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/pets/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
    },
  });
}

export function useGetPets() {
  return useQuery({
    queryKey: ['pets'],
    queryFn: async () => {
      const response = await api.get('/pets');
      return response.data as Pet[];
    },
  });
}

export function useGetMyPets() {
  return useQuery({
    queryKey: ['pets', 'me'],
    queryFn: async () => {
      const response = await api.get('/pets/me');
      return response.data as Pet[];
    },
  });
}
