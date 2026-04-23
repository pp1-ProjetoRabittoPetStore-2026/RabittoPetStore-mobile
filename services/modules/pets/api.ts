import { api } from '@/services/api';
import { Pet } from '@/shared/types/pet';

export const getPets = async (): Promise<Pet[]> => {
  try {
    const response = await api.get('/pets');
    return response.data;
  } catch (error) {
    console.error('Error fetching pets:', error);
    throw error;
  }
};

export const addPet = async (pet: Pet): Promise<void> => {
  try {
    await api.post('/pets', pet);
  } catch (error) {
    console.error('Error adding pet:', error);
    throw error;
  }
};

export const updatePet = async (id: string, pet: Pet): Promise<void> => {
  try {
    await api.put(`/pets/${id}`, pet);
  } catch (error) {
    console.error('Error updating pet:', error);
    throw error;
  }
};

export const deletePet = async (id: string): Promise<void> => {
  try {
    await api.delete(`/pets/${id}`);
  } catch (error) {
    console.error('Error deleting pet:', error);
    throw error;
  }
};
