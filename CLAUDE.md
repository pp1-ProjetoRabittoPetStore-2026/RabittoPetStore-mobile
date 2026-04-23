# CLAUDE.md — AI-Assisted Development Guidelines

Guide for effective collaboration with Claude AI on the **RabittoPetStore-mobile** project. Focuses on token efficiency, context management, and productive debugging workflows.

---

## Table of Contents

1. [Project Context at a Glance](#project-context-at-a-glance)
2. [When to Use Claude](#when-to-use-claude)
3. [Token Economy Strategies](#token-economy-strategies)
4. [Context Management](#context-management)
5. [Prompt Patterns](#prompt-patterns)
6. [Debugging Workflow](#debugging-workflow)
7. [Code Submission Best Practices](#code-submission-best-practices)
8. [API Integration Patterns](#api-integration-patterns)

---

## Project Context at a Glance

**Tech Stack:**

- React Native + TypeScript
- State: Zustand + React Query
- Forms: React Hook Form + Zod validation
- HTTP: Axios
- UI: Lucide React Native icons

**Key Principles:**

- Type safety first (strict TS)
- Component-driven architecture
- Barrel exports for clean imports
- Custom hooks for reusable logic

**Project Structure:**

```
├── CLAUDE.md
├── README.md
├── app
│   ├── _layout.tsx
│   └── index.tsx
├── app.json
├── assets
│   └── images
├── eslint.config.js
├── package-lock.json
├── package.json
├── pages
│   ├── home
│   │   ├── _components
│   │   │   └── index.ts
│   │   └── _hooks
│   │       └── index.ts
│   └── login
│       ├── _components
│       │   └── index.ts
│       └── _hooks
│           └── index.ts
├── services
│   ├── api.ts
│   └── modules
│       └── user
│           ├── api.ts
│           └── queries.ts
├── shared
│   ├── components
│   │   └── ui
│   │       └── index.ts
│   ├── hooks
│   │   └── index.ts
│   ├── services
│   ├── types
│   │   ├── type.d.ts
│   │   └── user.d.ts
│   └── utils
│       └── index.ts
└── tsconfig.json
```

---

## When to Use Claude

### ✅ Good Use Cases

- **Feature Development:** Building new screens, components, hooks
- **Debugging:** Understanding error messages, tracing bugs
- **Refactoring:** Improving code structure, reducing duplication
- **Type Issues:** Fixing TypeScript errors, improving type safety
- **API Integration:** Creating data-fetching hooks, validators
- **Performance:** Optimizing renders, memory leaks, bundle size

### ❌ Avoid Asking Claude For

- Generating boilerplate for entire features (break it down instead)
- Writing tests without context (separate conversation)
- Architecture decisions without discussing tradeoffs
- Copy-pasting large codebases without purpose

---

## Token Economy Strategies

### 1. Progressive Code Submission

**Instead of:** Sending entire components at once.

**Do this:** Break requests into logical chunks.

```
Session 1: "Here's my Zod schema for pet form validation.
           Can you review it?"

Session 2: "Now I need a form component using this schema.
           Should I use React Hook Form?"

Session 3: "Create the form component with validation and error handling."
```

**Benefit:** Each session is focused, Claude maintains tight context, fewer tokens wasted.

---

### 2. Create a `.claude` Directory

Store reference files Claude can read once per session:

```
.claude/
├── STACK.md              # Dependencies & versions
├── PATTERNS.md           # Code patterns used
├── API_CONTRACTS.md      # Backend API responses
├── TYPES_REFERENCE.md    # Common TypeScript interfaces
└── ARCHITECTURE.md       # Project structure guide
```

**Usage:**

```
"I'm building a new hook for fetching pets.
 Reference: .claude/PATTERNS.md, .claude/API_CONTRACTS.md

 Here's my hook: [code]
 Does it follow our patterns?"
```

**Benefit:** Claude reads reference files once, reduces repetitive explanations, fast lookups.

---

### 3. Use Focused Context Files

Create minimal context files, not entire codebase dumps.

```markdown
// .claude/PATTERNS.md

## Hook Pattern

All data-fetching hooks follow this:

- Param: query string or ID
- Returns: { data, isLoading, error }
- Uses: useQuery from @tanstack/react-query
- Validates response with Zod

## Form Pattern

All forms use:

- React Hook Form for state
- Zod for validation
- Form component wrapper
```

**Benefit:** Patterns are explicit, Claude doesn't guess, tokens stay low.

---

### 4. Single-Purpose Prompts

**Don't:** "Here's my entire Pet screen, review everything."

**Do:** "Review this form validation. Is the Zod schema correct?"

**Benefit:** Claude focuses, response is concise, tokens saved.

---

### 5. Reuse Sessions for Related Work

If you're working on authentication features:

- Session 1: Login hook
- Session 2: Token storage
- Session 3: Auth guard component

Claude builds context from Session 1 → 2 → 3, reducing repeated explanations.

---

## Context Management

### Start Every Session With Essentials

```
"Working on RabittoPetStore-mobile.

Tech Stack:
- React Native + TypeScript
- State: Zustand + React Query
- Forms: React Hook Form + Zod
- HTTP: Axios

Reference files: .claude/PATTERNS.md, .claude/API_CONTRACTS.md

Task: [your specific task]"
```

**Benefit:** Claude has immediate context, no wasted tokens on setup questions.

---

### File References

When sharing code, reference the file path:

```
"File: app/_hooks/useFetchPets.ts

[code snippet]

Issue: This hook isn't caching correctly. Why?"
```

**Benefit:** Claude understands code location, can suggest where to move things, file context helps.

---

### Minimal Error Context

When debugging, include only relevant info:

```
DON'T:
"I'm getting an error in my app. Here's 50 lines of stack trace..."

DO:
"Error: 'Cannot read property email of undefined'
 Location: app/pages/login/LoginForm.tsx:45
 Code: const email = user.email;
 Context: After login, user object is null instead of populated"
```

**Benefit:** Claude diagnoses faster, fewer tokens burned on irrelevant context.

---

## Prompt Patterns

### Pattern 1: Code Review

```
"File: app/_components/Button.tsx

[code]

Review checklist:
- TypeScript types correct?
- Accessibility (a11y)?
- Props match design system?"
```

### Pattern 2: Bug Diagnosis

```
"Component: useFetchPets hook
Error: 'isFetching is undefined'
Context: Using React Query v5

Code:
[relevant snippet]

What's wrong?"
```

### Pattern 3: Implementation Request

```
"I need a custom hook to:
1. Fetch user's pets from API
2. Cache results for 5 minutes
3. Validate response with Zod
4. Handle errors gracefully

Stack: React Query, Zod, Axios
Reference: .claude/PATTERNS.md"
```

### Pattern 4: Refactoring

```
"This component is getting large:

[code - 30-40 lines]

Can you suggest how to split this into smaller components?
Keep in mind: [specific constraint]"
```

---

## Debugging Workflow

### Step 1: Isolate the Problem

Before asking Claude, narrow it down:

- **Is it a build error?** Run `npm start` first.
- **Is it a runtime error?** Check the error message (not full stack trace).
- **Is it a logic error?** Add `console.log` statements, identify where logic breaks.

### Step 2: Provide Minimal Context

```
"LoginScreen.tsx, line 24:

const handleLogin = async () => {
  const response = await loginAPI(email, password);
  console.log(response); // Returns { success: true, data: null }
}

Expected: data should contain user object
Actual: data is null

Schema (Zod): [paste schema]"
```

### Step 3: Ask Specific Question

```
"Why is data null even though success is true?
Should I validate with Zod before using the response?"
```

### Step 4: Iterate

- Claude suggests fix
- You apply it locally
- **Next session:** "Applied your suggestion, now getting error X..."

---

## Code Submission Best Practices

### ✅ DO: Provide Context + Code Together

```
"Building useFetchPets hook.

Needs:
- Fetch from GET /pets/:userId
- Return { data: Pet[], isLoading, error }
- Cache 5 minutes
- Validate with Zod schema

Here's my attempt:
[code]

Does this follow our pattern (.claude/PATTERNS.md)?"
```

### ✅ DO: Use Code Blocks with Language Labels

````
```typescript
const useFetchPets = (userId: string) => {
  // code
}
```
````

### ✅ DO: Reference Previous Context

```
"Building on the LoginHook we just created:
Here's the useAuth wrapper: [code]

Does this look good?"
```

### ❌ DON'T: Dump 100-Line Files

Instead: Send relevant sections (20-40 lines max).

### ❌ DON'T: Vague Descriptions

Instead of: "Fix this component"
Say: "The email validation isn't working. Zod schema validates, but form still submits invalid emails."

---

## API Integration Patterns

### Expected Response Format

All API responses follow this structure:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

### When Building API Hooks

1. **Define the response type:**

   ```typescript
   interface Pet {
     id: string;
     name: string;
     species: string;
   }
   ```

2. **Create Zod validator:**

   ```typescript
   const petSchema = z.object({ id: z.string(), ... })
   ```

3. **Reference in hook:**
   ```typescript
   const { data } = useQuery({
     queryFn: async () => {
       const res = await client.get('/pets');
       return petSchema.array().parse(res.data.data);
     },
   });
   ```

**When asking Claude:** Reference `API_CONTRACTS.md` so Claude knows exact response shapes.

---

## Session Structure Example

### Session 1: Planning (Low-Token)

```
"I'm building the PetProfile screen.

Needs:
1. Fetch pet data
2. Display pet info (name, species, age)
3. Show edit button
4. List past appointments

Should I create:
- Custom hook (useFetchPet)?
- Or use useQuery directly in component?"
```

Claude answers, you save the response.

### Session 2: Hook Implementation (Medium-Token)

```
"Building useFetchPet hook.

Reference: .claude/PATTERNS.md (data-fetching pattern)

Here's my attempt: [code]

Does this match our pattern?"
```

### Session 3: Component Implementation (Medium-Token)

```
"Now building PetProfile component using useFetchPet hook.

Requirements:
- Show loading skeleton
- Display pet info (see API response in .claude/API_CONTRACTS.md)
- Edit button navigates to edit screen
- Error state

Here's my component: [code]

What am I missing?"
```

**Total tokens:** ~15k-20k for entire feature (split into focused sessions).

---

## Quick Checklist Before Asking Claude

- [ ] Problem is isolated and clearly described
- [ ] Code snippet is <50 lines (or reference larger files)
- [ ] Reference files mentioned (.claude/PATTERNS.md, etc)
- [ ] Specific question asked (not vague)
- [ ] Expected vs actual behavior stated
- [ ] Stack/dependencies clear

---

## Anti-Patterns to Avoid

| ❌ Anti-Pattern              | ✅ Better Approach                                                              |
| ---------------------------- | ------------------------------------------------------------------------------- |
| "My app is broken, help"     | "LoginScreen form validation fails on line X. Here's the error and code."       |
| Entire 200-line component    | "Here's the form section (40 lines). Is validation logic correct?"              |
| "Make this better"           | "Refactor this for readability. What would you split into separate components?" |
| No context provided          | "Working on auth flow. Reference: .claude/PATTERNS.md. Here's my hook: [code]"  |
| Every question in one prompt | Split into focused questions across multiple prompts                            |

---

## References

- **React Query:** Caching, invalidation strategies
- **Zod:** Validation error handling
- **React Hook Form:** Integration with validation libraries
- **Zustand:** Global state (use sparingly)
- **TypeScript:** Strict mode, inference

---

## Last Updated

April 2026 — RabittoPetStore-mobile v1.0
