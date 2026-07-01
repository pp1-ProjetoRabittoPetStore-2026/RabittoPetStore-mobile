import { z } from 'zod';

export const petSchema = z.object({
  nome: z.string().min(2, 'O nome do pet é obrigatório'),
  especie: z.string().min(1, 'Selecione a espécie'),
  raca: z.string().min(1, 'Selecione a raça'),
  porte: z.enum(['pequeno', 'médio', 'grande']),
  idade: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => val >= 0, 'Idade inválida'),
});

export type PetFormData = z.infer<typeof petSchema>;
