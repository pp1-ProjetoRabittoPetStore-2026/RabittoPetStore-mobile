import { z } from 'zod';

export const registerSchema = z
  .object({
    nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    email: z.email('E-mail inválido'),
    telefone: z.string().min(10, 'Telefone inválido (mínimo 10 dígitos)'),
    senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    confirmarSenha: z.string().min(1, 'Confirme a senha'),
  })
  .refine((d) => d.senha === d.confirmarSenha, {
    message: 'As senhas não conferem',
    path: ['confirmarSenha'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
