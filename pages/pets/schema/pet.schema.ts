import { z } from 'zod';

export const petSchema = z.object({
  nome: z.string().min(2, 'O nome do pet é obrigatório'),
  especie: z.string().min(3, 'Ex: Cachorro, Gato...'),
  raca: z.string().min(3, 'Informe a raça ou SRD'),
  idade: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => val >= 0, 'Idade inválida'),
});

export type PetFormData = z.infer<typeof petSchema>;
