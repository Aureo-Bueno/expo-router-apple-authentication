# Reorganização da estrutura de pastas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mover hooks e tipos existentes para `hooks/` e `types/`, com barrels `@/hooks` e `@/types`, atualizando imports sem mudar comportamento.

**Architecture:** Os diretórios `hooks/` e `types/` passam a ser as fontes únicas para hooks customizados e tipagens compartilhadas. `components/` mantém apenas componentes visuais e testes. Nenhum re-export permanece nos caminhos antigos.

**Tech Stack:** Expo SDK 58, Expo Router, React Native 0.88.1, TypeScript 6.0.3, Biome 2.6.8, Jest 30.5.2.

**Spec:** `docs/superpowers/specs/2026-11-23-folder-structure-reorganization-design.md`

## Global Constraints

- Não executar `git commit` em nenhuma etapa.
- Não alterar rotas, telas ou comportamento de `app/`; apenas imports nos dois layouts.
- Não alterar `assets/`, `constants/`, `services/`, `app.json`, `package.json`, `tsconfig.json`, Biome, Husky ou Metro.
- Não extrair `useThemeColor` de `components/Themed.tsx`.
- Não criar testes novos; a suíte existente é regressão.
- Todos os imports novos devem usar os aliases `@/hooks` e `@/types`, já habilitados por `paths: { "@/*": ["./*"] }`.
- Usar aspas simples e trailing commas, conforme Biome configurado.

---

### Task 1: Migrar hooks para `hooks/` com barrel

**Files:**

- Create: `hooks/index.ts`
- Modify: `app/_layout.tsx:8`
- Modify: `app/(tabs)/_layout.tsx:3-4`
- Modify: `components/Themed.tsx:10`
- Move: `components/useColorScheme.ts` → `hooks/useColorScheme.ts`
- Move: `components/useColorScheme.web.ts` → `hooks/useColorScheme.web.ts`
- Move: `components/useClientOnlyValue.ts` → `hooks/useClientOnlyValue.ts`
- Move: `components/useClientOnlyValue.web.ts` → `hooks/useClientOnlyValue.web.ts`
- Test: `npx tsc --noEmit`

**Interfaces:**

- Consumes: alias `@/*` definido em `tsconfig.json`; exports nomeados atuais dos 4 arquivos de hook.
- Produces: `@/hooks` exportando `useColorScheme` e `useClientOnlyValue`; variantes `.web.ts` continuam com o mesmo nome de módulo base.

- [x] **Step 1: Trocar imports para `@/hooks` antes de mover os arquivos**

Em `app/_layout.tsx`, substituir a linha de import existente por:

```ts
import { useColorScheme } from '@/hooks';
```

Em `app/(tabs)/_layout.tsx`, substituir as duas linhas de import existentes por uma única linha:

```ts
import { useClientOnlyValue, useColorScheme } from '@/hooks';
```

Em `components/Themed.tsx`, substituir a linha `import { useColorScheme } from './useColorScheme';` por:

```ts
import { useColorScheme } from '@/hooks';
```

- [x] **Step 2: Rodar check esperado falhar**

Run: `npx tsc --noEmit`

Expected: FAIL com `Cannot find module '@/hooks' or its corresponding type declarations.` nos três arquivos alterados.

- [x] **Step 3: Criar diretório e mover os hooks preservando histórico**

Run:

```bash
mkdir -p hooks
git mv components/useColorScheme.ts hooks/useColorScheme.ts
git mv components/useColorScheme.web.ts hooks/useColorScheme.web.ts
git mv components/useClientOnlyValue.ts hooks/useClientOnlyValue.ts
git mv components/useClientOnlyValue.web.ts hooks/useClientOnlyValue.web.ts
```

Expected: nenhum output além do próprio git; os 4 arquivos existem em `hooks/`.

- [x] **Step 4: Criar o barrel de hooks**

Create `hooks/index.ts` com:

```ts
export * from './useClientOnlyValue';
export * from './useColorScheme';
```

- [x] **Step 5: Rodar check esperado passar**

Run: `npx tsc --noEmit`

Expected: sem output.

- [x] **Step 6: Rodar lint do escopo alterado**

Run: `npm run lint`

Expected: `Checked 37 files` ou mais, sem erros.

---

### Task 2: Consolidar tipos em `types/` com barrel

**Files:**

- Create: `types/index.ts`
- Move: `components/DogsList/types.ts` → `types/dogs.ts`
- Move: `components/LocationsList/types.ts` → `types/locations.ts`
- Delete: `components/DogsList/DogDescription/types.ts`
- Modify: `types/dogs.ts`
- Modify: `components/DogsList/graphql.ts:2`
- Modify: `components/DogsList/DogDescription/graphql.ts:2`
- Modify: `components/LocationsList/graphql.ts:2`
- Modify: `components/LocationsList/RenderLocations/index.tsx:3`
- Test: `npx tsc --noEmit`

**Interfaces:**

- Consumes: `@/types` ainda não existe no início da task.
- Produces: `DogsData`, `Dog`, `DogDescriptionData`, `DogDescriptionVariables` e `ILocations` exportados por `@/types`.

- [x] **Step 1: Trocar imports locais por `@/types` antes de criar os arquivos**

Em `components/DogsList/graphql.ts`, substituir o import de `./types` por:

```ts
import type { DogsData } from '@/types';
```

Em `components/DogsList/DogDescription/graphql.ts`, substituir o import de `./types` por:

```ts
import type { DogDescriptionData, DogDescriptionVariables } from '@/types';
```

Em `components/LocationsList/graphql.ts`, substituir o import de `./types` por:

```ts
import type { ILocations } from '@/types';
```

Em `components/LocationsList/RenderLocations/index.tsx`, substituir o import de `../types` por:

```ts
import type { ILocations } from '@/types';
```

O conteúdo final de `components/DogsList/DogDescription/graphql.ts` deve ser:

```ts
import { gql, type TypedDocumentNode } from '@apollo/client';
import type { DogDescriptionData, DogDescriptionVariables } from '@/types';

export const GET_DOG_QUERY: TypedDocumentNode<DogDescriptionData, DogDescriptionVariables> = gql`
  query GetDog($id: String) {
    dog(id: $id) {
      id
      name
      breed
    }
  }
`;
```

- [x] **Step 2: Rodar check esperado falhar**

Run: `npx tsc --noEmit`

Expected: FAIL com `Cannot find module '@/types' or its corresponding type declarations.` e, caso a renomeação tenha sido feita antes da criação dos tipos, `Cannot find name 'DogDescriptionData'` / `Cannot find name 'DogDescriptionVariables'`.

- [x] **Step 3: Mover arquivos de tipos preservando histórico**

Run:

```bash
mkdir -p types
git mv components/DogsList/types.ts types/dogs.ts
git mv components/LocationsList/types.ts types/locations.ts
git rm components/DogsList/DogDescription/types.ts
```

Expected: `types/dogs.ts` e `types/locations.ts` existem; o arquivo antigo de `DogDescription` foi removido.

- [x] **Step 4: Escrever `types/dogs.ts`**

Substituir todo o conteúdo de `types/dogs.ts` por:

```ts
export interface Dog {
  id: string;
  name: string;
  breed: string;
}

export interface DogsData {
  dogs: Array<Dog>;
}

export interface DogDescriptionData {
  dog: Dog;
}

export interface DogDescriptionVariables {
  id: string;
}
```

- [x] **Step 5: Confirmar `types/locations.ts`**

Garantir que `types/locations.ts` contém exatamente:

```ts
export interface ILocations {
  id: string;
  name: string;
  description: string;
  photo: string;
}
```

- [x] **Step 6: Criar o barrel de tipos**

Create `types/index.ts` com:

```ts
export * from './dogs';
export * from './locations';
```

- [x] **Step 7: Rodar check esperado passar**

Run: `npx tsc --noEmit`

Expected: sem output.

- [x] **Step 8: Rodar lint do escopo alterado**

Run: `npm run lint`

Expected: `Checked 39 files` ou mais, sem erros.

---

### Task 3: Limpar caminhos antigos e validar o projeto inteiro

**Files:**

- Verify: `app/`, `components/`, `hooks/`, `types/`
- No content changes expected.

**Interfaces:**

- Consumes: `@/hooks` e `@/types` de Tasks 1 e 2.
- Produces: projeto pronto sem imports antigos e com validação completa registrada.

- [x] **Step 1: Buscar imports antigos**

Run:

```bash
rg -n "@/components/useColorScheme|@/components/useClientOnlyValue|from ['\"]\./types['\"]|from ['\"]\.\./types['\"]|from ['\"]\.\./\.\./types['\"]" app components || true
```

Expected: nenhuma linha encontrada.

- [x] **Step 2: Verificar arquivos antigos removidos**

Run:

```bash
ls components/use*.ts components/**/types.ts 2>/dev/null || true
```

Expected: nenhum caminho listado.

- [x] **Step 3: Verificar árvore final**

Run:

```bash
find app assets components constants hooks services types -maxdepth 3 -type f | sort
```

Expected: `hooks/` com 5 arquivos (`index.ts` + 4 hooks) e `types/` com 3 arquivos (`index.ts`, `dogs.ts`, `locations.ts`); nenhum `components/**/types.ts`.

- [x] **Step 4: Rodar validação TypeScript**

Run: `npx tsc --noEmit`

Expected: sem output.

- [x] **Step 5: Rodar lint e hook de pre-commit**

Run: `npm run lint && sh .husky/pre-commit`

Expected: duas execuções de `biome check .`, ambas terminando sem erros.

- [x] **Step 6: Rodar testes**

Run: `npx jest --ci --runInBand`

Expected: `1 passed`, `Snapshots: 1 passed`.

- [x] **Step 7: Rodar checagens do Expo**

Run: `npx expo-doctor && npx expo install --check`

Expected: `20/20 checks passed. No issues detected!` e `Dependencies are up to date`.

- [x] **Step 8: Rodar export web completo**

Run: `npx expo export --platform web --output-dir /tmp/opencode/expo-web-structure`

Expected: `Exported: /tmp/opencode/expo-web-structure`, com rotas estáticas geradas sem erro de resolução `.web.ts`.

- [x] **Step 9: Confirmar que nenhum commit foi criado**

Run: `git log -1 --oneline`

Expected: mesmo hash de antes desta tarefa. Não executar `git add` com intenção de commit.
