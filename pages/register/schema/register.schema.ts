import { z } from 'zod';

export const registerSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  telefone: z.string().min(10, 'Telefone inválido (mínimo 10 dígitos)'),
  senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
