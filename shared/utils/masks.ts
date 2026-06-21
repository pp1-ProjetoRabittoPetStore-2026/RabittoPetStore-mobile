import { format, type Replacement } from '@react-input/mask';

// @react-input/mask é DOM-only (useMask/InputMask). No React Native usamos a
// função imperativa `format` dentro do onChangeText do TextInput.

// Cada "_" aceita apenas um dígito.
const DIGIT: Replacement = { _: /\d/ };

type MaskConfig = { mask: string; replacement: Replacement };

export const MASKS = {
  cpf: { mask: '___.___.___-__', replacement: DIGIT },
  telefone: { mask: '(__) _____-____', replacement: DIGIT },
  cep: { mask: '_____-___', replacement: DIGIT },
} satisfies Record<string, MaskConfig>;

const apply = (options: MaskConfig) => (value: string) => format(value, options);

export const maskCPF = apply(MASKS.cpf);
export const maskTelefone = apply(MASKS.telefone);
export const maskCEP = apply(MASKS.cep);
