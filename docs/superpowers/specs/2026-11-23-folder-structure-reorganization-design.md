# Reorganização da estrutura de pastas

## Contexto

O projeto Expo Router já possui `app/`, `assets/`, `components/`, `constants/`, `services/`, `app.json`, `package.json` e `tsconfig.json`. Faltam `hooks/` e `types/`, e parte do código que deveria viver nesses lugares está hoje dentro de `components/` (`useColorScheme`, `useClientOnlyValue` e arquivos `types.ts` de `DogsList`/`LocationsList`).

O usuário pediu para configurar a estrutura de pastas e escolheu reorganizar o código existente em vez de apenas criar diretórios vazios.

## Objetivos

- Criar `hooks/` e `types/` como diretórios de primeira classe do projeto.
- Mover hooks customizados e tipagens compartilhadas para esses diretórios.
- Expor barrels `@/hooks` e `@/types` para imports curtos e estáveis.
- Atualizar todos os imports afetados e remover os caminhos antigos.
- Manter o comportamento do app inalterado.

## Fora de escopo

- Criar commits (a sessão atual não deve commitar).
- Alterar rotas, telas ou comportamento de `app/`, `assets/`, `constants/`, `services/`, configurações do Expo/Biome/Husky ou dependências. Ajustes de import nos layouts de `app/` estão incluídos.
- Extrair `useThemeColor` de `components/Themed.tsx`.
- Criar testes novos além dos existentes.

## Decisões aprovadas

1. Abordagem completa com barrels.
2. Tipos organizados por domínio: `types/dogs.ts`, `types/locations.ts` e `types/index.ts`.
3. Hooks movidos com suas variantes de plataforma e `hooks/index.ts`.
4. Nenhum re-export nos caminhos antigos.
5. Tipos genéricos `Data` e `Variables` renomeados para `DogDescriptionData` e `DogDescriptionVariables`.
6. `DogProps` removido por estar unused.
7. `Dog` passa a ser exportado de `types/dogs.ts`.

## Estrutura final

```text
app/                         # inalterado
assets/                      # inalterado
components/
  DogsList/
  LocationsList/
  StyledText.tsx
  TabBarIcon/
  Themed.tsx
  __tests__/
constants/Colors.ts
hooks/
  index.ts
  useClientOnlyValue.ts
  useClientOnlyValue.web.ts
  useColorScheme.ts
  useColorScheme.web.ts
services/client.ts
types/
  dogs.ts
  locations.ts
  index.ts
.expo/, node_modules/, dist/ # ignorados
```

## Mudanças de arquivo

### Movimentações

- `components/useColorScheme.ts` → `hooks/useColorScheme.ts`
- `components/useColorScheme.web.ts` → `hooks/useColorScheme.web.ts`
- `components/useClientOnlyValue.ts` → `hooks/useClientOnlyValue.ts`
- `components/useClientOnlyValue.web.ts` → `hooks/useClientOnlyValue.web.ts`
- `components/DogsList/types.ts` → `types/dogs.ts`
- `components/DogsList/DogDescription/types.ts` → conteúdo mesclado em `types/dogs.ts`
- `components/LocationsList/types.ts` → `types/locations.ts`

Todas as movimentações devem usar `git mv` quando aplicável.

### Arquivos novos

- `hooks/index.ts`: reexporta `./useClientOnlyValue` e `./useColorScheme`.
- `types/index.ts`: reexporta `./dogs` e `./locations`.

### Conteúdo de `types/dogs.ts`

- `DogsData` (existente).
- `Dog` (existente, passa a `export interface Dog`).
- `DogDescriptionData` (antigo `Data`).
- `DogDescriptionVariables` (antigo `Variables`).
- `DogProps` não é incluído.

### Conteúdo de `types/locations.ts`

- `ILocations` (existente).

## Atualizações de imports

- `app/_layout.tsx`: `useColorScheme` de `@/hooks`.
- `app/(tabs)/_layout.tsx`: `useClientOnlyValue` e `useColorScheme` de `@/hooks`.
- `components/Themed.tsx`: `useColorScheme` de `@/hooks`.
- `components/DogsList/graphql.ts`: `DogsData` de `@/types`.
- `components/DogsList/DogDescription/graphql.ts`: `DogDescriptionData` e `DogDescriptionVariables` de `@/types`.
- `components/LocationsList/graphql.ts`: `ILocations` de `@/types`.
- `components/LocationsList/RenderLocations/index.tsx`: `ILocations` de `@/types`.

Nenhum import deve continuar apontando para `./types`, `../types`, `@/components/useColorScheme` ou `@/components/useClientOnlyValue`.

## Riscos e mitigação

- **Resolução `.web.ts`:** mover os arquivos pode alterar a precedência de plataforma do Metro. Mitigação: export web completo, não apenas `tsc`.
- **Colisão de nomes no barrel:** `Data`/`Variables` são genéricos demais. Mitigação: renomeá-los antes de reexportar.
- **Ciclos de import:** barrels podem criar ciclos se components voltarem a ser importados por hooks. Mitigação: `hooks/` e `types/` não importam `components/`.
- **Arquivos órfãos:** imports antigos podem sobrar. Mitigação: busca final por padrões antigos antes da validação.

## Validação

Comandos obrigatórios após a implementação:

- `npx tsc --noEmit`
- `npm run lint`
- `npx jest --ci --runInBand`
- `npx expo-doctor`
- `npx expo install --check`
- `sh .husky/pre-commit`
- `npx expo export --platform web --output-dir /tmp/opencode/expo-web-structure`

Todos devem passar sem erros. O export web deve continuar gerando as rotas estáticas atuais.

## Critérios de aceitação

- `hooks/` contém os 4 hooks e `index.ts`.
- `types/` contém `dogs.ts`, `locations.ts` e `index.ts`.
- Nenhum arquivo `components/**/types.ts` ou `components/use*.ts` permanece.
- Nenhum import antigo permanece.
- Todos os comandos de validação passam.
- Nenhum commit é criado.
