import { api } from '@/services/api';
import { Especie } from './types';

export const getEspecies = async (): Promise<Especie[]> => {
  try {
    const response = await api.get('/especies');
    return response.data;
  } catch (error) {
    console.error('Error fetching especies:', error);
    throw error;
  }
};

export const getPortes = async (): Promise<string[]> => {
  try {
    const response = await api.get('/especies/portes');
    return response.data;
  } catch (error) {
    console.error('Error fetching portes:', error);
    throw error;
  }
};
