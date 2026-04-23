# RabittoPetStore-mobile

Aplicativo mobile da plataforma **Rabitto Pet Store** — sistema de gestão de cuidados com animais de estimação. Disciplina: PP1.

> **Perspectiva:** Tutor (Cliente)

---

## 📱 Sobre o Projeto

RabittoPetStore é um aplicativo que permite tutores gerenciar o cuidado de seus pets de forma integrada e intuitiva. O app oferece funcionalidades como agendamento de serviços, rastreamento de saúde, histórico de atendimentos e comunicação com prestadores.

---

## 🛠️ Stack Tecnológico

### Frontend

- **React Native** — UI multiplataforma
- **TypeScript** — Type safety
- **Zustand** — Gerenciamento de estado leve
- **React Hook Form** — Validação e manejo de forms
- **Zod** — Schema validation robusta
- **Lucide React Native** — Ícones vetoriais
- **TanStack React Query** — Data fetching e caching
- **Axios** — Cliente HTTP
- **date-fns** — Manipulação de datas

### Estrutura de Pastas

```
app/
├── _layout.tsx          # Configuração de rotas e layout
├── index.tsx            # Tela inicial
├── pages/               # Telas principais
│   ├── home/
│   ├── login/
│   └── shared/          # Telas compartilhadas
├── _components/         # Componentes reutilizáveis
│   └── index.ts         # Barrel exports
├── _hooks/              # Custom hooks
│   └── index.ts
├── types/               # TypeScript types
│   └── type.d.ts
├── utils/               # Funções utilitárias
│   └── index.ts
├── hooks/               # Hooks globais
│   └── index.ts
└── assets/              # Imagens e recursos estáticos
```

---

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Expo CLI

### Instalação

```bash
# Clone o repositório
git clone <seu-repo>
cd RabittoPetStore-mobile

# Instale as dependências
npm install

# Instale as dependências específicas do projeto
npm install axios @tanstack/react-query zod zustand lucide-react-native date-fns react-hook-form
```

### Rodando o Projeto

```bash
# Desenvolvimento
npm start

# iOS (macOS only)
npm run ios

# Android
npm run android

# Web
npm run web
```

---

## 📋 Funcionalidades Principais

- ✅ **Autenticação** — Login/logout seguro
- ✅ **Perfil do Pet** — Criar e gerenciar informações dos animais
- ✅ **Agendamentos** — Marcar serviços (vet, grooming, etc)
- ✅ **Histórico** — Rastrear atendimentos e cuidados
- ✅ **Notificações** — Alertas de lembretes e atualizações
- ✅ **Integração API** — Sincronização com backend em tempo real

---

## 🏗️ Arquitetura

### Padrões Utilizados

**State Management**

- Zustand para estado global leve
- React Query para cache de dados do servidor
- React Hook Form para estado de formulários

**API Integration**

- Axios com interceptadores para auth
- Separação clara entre client HTTP e hooks
- Tipagem end-to-end (Zod + TypeScript)

**Componentes**

- Componentes funcionais com hooks
- Componentes reutilizáveis isolados em `_components/`
- Barrel exports em `index.ts` para imports limpos

---

## 🔐 Autenticação

A autenticação é gerenciada via tokens JWT.

```typescript
// Exemplo de fluxo
1. Login com credenciais
2. Recebe token JWT
3. Token armazenado em state/storage
4. Interceptador adiciona token em cada request
5. Logout limpa o estado
```

---

## 📡 API

O app se comunica com o backend via Axios:

```typescript
// Baseado em seu padrão
const client = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});
```

### Resposta Padrão

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

---

## 🧪 Validação de Dados

Utiliza **Zod** para schemas de validação:

```typescript
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});
```

Integrado com **React Hook Form** para forms robustos.

---

## 📦 Dependências Principais

| Pacote                | Versão | Uso                     |
| --------------------- | ------ | ----------------------- |
| axios                 | Latest | HTTP client             |
| @tanstack/react-query | Latest | Data fetching & caching |
| zod                   | Latest | Schema validation       |
| zustand               | Latest | State management        |
| react-hook-form       | Latest | Form handling           |
| lucide-react-native   | Latest | Icons                   |
| date-fns              | Latest | Date utilities          |

---

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz:

```env
EXPO_PUBLIC_API_URL=https://api.rabittopetstore.com
EXPO_PUBLIC_APP_ENV=development
```

---

## 📝 Convenções de Código

- **Nomes de arquivos:** `camelCase` (componentes) ou `snake_case` (utilitários)
- **Componentes:** PascalCase
- **Funções:** camelCase
- **Tipos:** PascalCase com prefixo `I` se interface (ex: `IUser`)
- **Imports:** Agrupe por tipo (externas, internas, types, utils)

---

## 🐛 Troubleshooting

### App não inicia

```bash
# Limpe cache e reinstale
npm install
npx expo prebuild --clean
npm start -- --clear
```

### Erro de conexão com API

- Verifique se `.env.local` está configurado
- Teste a URL da API
- Verifique interceptadores do Axios

### Problema com validação

- Revise o schema Zod
- Confirme se React Hook Form está bindando corretamente

---

## 📚 Recursos Úteis

- [React Native Docs](https://reactnative.dev)
- [Expo Documentation](https://docs.expo.dev)
- [React Query Docs](https://tanstack.com/query/latest)
- [Zod Docs](https://zod.dev)
- [Zustand Docs](https://github.com/pmndrs/zustand)

---

## 👨‍💻 Contribuindo

1. Crie uma branch para sua feature: `git checkout -b feature/sua-feature`
2. Commit suas mudanças: `git commit -m 'Add: descrição clara'`
3. Push para a branch: `git push origin feature/sua-feature`
4. Abra um Pull Request

---

## 📄 Licença

[Defina sua licença aqui]

---

**Última atualização:** Abril 2026
