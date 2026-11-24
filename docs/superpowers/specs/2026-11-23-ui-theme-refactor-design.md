# Refatoração visual com tema default — design

## Contexto

O app já possui autenticação Apple, persistência de sessão e telas GraphQL, mas a interface ainda mistura três linguagens visuais: o card novo da tela de Sign, os estilos default do React Navigation nas tabs e os componentes `Themed` antigos nas telas de lista. A tab bar tem cinco rótulos genéricos em inglês e mantém a rota `sign` com o rótulo `Sign` depois do login.

Este design centraliza esses estilos em um tema default e alinha todas as telas, componentes de lista e estados de navegação ao mesmo padrão visual da tela de login.

## Decisões aprovadas

- Abordagem: tema central + primitives de UI em `components/ui/`.
- Escopo: todas as telas e componentes visíveis, incluindo modal, not-found, listas, `DogDescription` e background web.
- Tema: centralizar tudo; `constants/Colors.ts` vira adaptador dos tokens.
- Depois do login, a rota `sign` vira aba **Sair**.
- A aba **Sair** chama `signOut()` diretamente, sem confirmação.
- Correções óbvias nas listas são permitidas, sem mudar regras de negócio.
- Nenhum commit será criado.

## Arquitetura

### Tema

Criar:

- `theme/tokens.ts`: paleta light/dark, espaçamentos, raios, tipografia e sombras.
- `theme/index.ts`: exporta `getTheme`, `useAppTheme` e `getNavigationTheme`.

`useAppTheme()` usa `useColorScheme()` de `@/hooks` e retorna o token set correspondente. Não haverá novo `Context`, pois o esquema de cores já vem do hook existente e do `userInterfaceStyle: automatic`.

`getNavigationTheme(theme)` converte os tokens para o formato esperado pelo `ThemeProvider` do React Navigation, substituindo o uso direto de `DarkTheme`/`DefaultTheme` em `app/_layout.tsx`.

`constants/Colors.ts` passa a derivar `text`, `background`, `tint`, `tabIconDefault` e `tabIconSelected` dos tokens, preservando a compatibilidade de imports até que todos os consumidores sejam migrados.

`components/Themed.tsx` passa a usar `useAppTheme()` diretamente. As props `lightColor` e `darkColor` continuam funcionando.

### Primitives de UI

Criar em `components/ui/`:

- `Screen.tsx`: container com background, scroll, padding e largura máxima.
- `ScreenHeader.tsx`: eyebrow com regra curta, título e descrição.
- `Card.tsx`: superfície com borda, raio, padding e sombra.
- `StateBlock.tsx`: estados de loading, erro e vazio.
- `ActionButton.tsx`: botão pressionável themeado.
- `index.ts`: barrel exports.

Mover `app/(tabs)/styles.ts` para `components/ui/styles.ts` e remover o original. Isso elimina a rota acidental `/styles` gerada pelo Expo Router.

## Tokens visuais

Cores light:

- background: `#F3F3F1`
- surface/card: `#FFFFFF`
- text: `#15171D`
- textMuted: `#6C7079`
- border: `#E3E3E0`
- primary: `#2F95DC`
- success: `#1B7F57`
- successBackground: `#E8F5EE`
- error: `#B4443F`
- errorBackground: `#FBEAE8`

Cores dark:

- background: `#111318`
- surface/card: `#1B1E25`
- text: `#F4F5F7`
- textMuted: `#9DA3AF`
- border: `#2C313A`
- primary: `#2F95DC`
- success: `#5FD3A0`
- successBackground: `#16332A`
- error: `#FF8A84`
- errorBackground: `#3A2224`

Espaçamentos: `xs: 4`, `sm: 8`, `md: 12`, `lg: 16`, `xl: 24`, `xxl: 32`.

Raios: `sm: 8`, `md: 12`, `lg: 16`, `xl: 20`.

Tipografia: `SpaceMono` para eyebrow e labels; título 28/700; corpo 15/22; label 11 com letterSpacing 1.4 no eyebrow e 0.3 nas tabs.

Sombra do card: `shadowColor: #000`, offset vertical 8, opacity 0.08, radius 20, elevation 4.

## Navegação e tabs

`app/(tabs)/_layout.tsx`:

- Usa `getNavigationTheme` no root layout.
- Mantém o gate: se `isReady`, `!signedIn` e o pathname não termina em `/sign`, redireciona para `/(tabs)/sign`.
- Enquanto `!isReady`, mostra um `StateBlock` de loading themeado.
- Deslogado: apenas a rota `sign` aparece, com rótulo **Entrar** e ícone `sign-in`.
- Logado: rótulos **Início**, **Sobre**, **Locais**, **Cães**, **Sair**.
- Rotas protegidas usam `href: null` quando `!signedIn`.
- A rota `sign` usa `tabBarButton` customizado quando `signedIn`; o botão chama `signOut()` diretamente e não navega.
- Tab bar: background `surface`, borda superior `border`, altura 64, label 11 em SpaceMono, ícone 22, ativo em `primary`, inativo em `textMuted`.
- `components/TabBarIcon/index.tsx` usa tamanho 22 e remove o `marginBottom: -3`.

Após `signOut()`, a mudança de `signedIn` dispara o gate e leva o usuário de volta à tela de Sign.

## Telas

### Sign

- Mantém integralmente o comportamento atual: scopes `FULL_NAME` e `EMAIL`, nome exibido, cancelamento silencioso, mensagem de erro amigável, loading, welcome e sign-out.
- Remove `lightPalette` e `darkPalette` locais; passa a consumir `useAppTheme()` e primitives.
- Mensagens permanecem:
  - `Bem-vindo, <nome>!`
  - `Não foi possível entrar com a Apple. Tente novamente.`
  - fallback de nome: `usuário`.

### Home

- Substitui o placeholder `Tab One`.
- Card de boas-vindas com eyebrow `APPLE ID`, nome do usuário e texto curto sobre a sessão local.
- Atalhos themeados para Cães, Locais e Sobre.
- Sem dados fictícios.

### About

- Substitui `Tab About` e o `Button` default.
- Conteúdo em português explicando que o projeto demonstra:
  - autenticação com Apple usando `expo-apple-authentication`;
  - sessão persistida com `expo-secure-store`;
  - consultas GraphQL com Apollo Client;
  - navegação com Expo Router;
  - telas de Dogs e Locations consumindo uma API GraphQL com estados de loading/erro.
- Cards curtos para `Apple Sign In`, `Secure Store`, `Apollo GraphQL` e `Expo Router`.
- Link para `/modal` usa `ActionButton` em vez do `Button` nativo.

### Dogs e Locations

- Header de seção com eyebrow `GRAPHQL`, título e descrição.
- Listas renderizadas em cards themeados.
- Loading, erro e vazio usam `StateBlock`.
- Imagens de Locations usam raio e borda do tema.

Correções óbvias incluídas:

- `DogsList`: `Reload` chama `refetch` do `useQuery`.
- `DogsList`: remover `navigate('DogsDescription')` e o `onPress` inválido do item.
- `DogsList`: adicionar `breed` à query GraphQL, pois o tipo `Dog` e a UI já esperam esse campo.
- `DogsList` e `DogDescription`: remover `console.log`.
- `DogDescription`: alinhar ao tema mesmo sem rota ativa.

### Modal e not-found

- Usar `Screen`, `Card`, `ScreenHeader` e `ActionButton`.
- Copy em português.
- Botão `Voltar` usa `router.back()`.
- Cores hardcoded `#2e78b7`, `#eee` e `rgba(255,255,255,0.1)` são substituídas por tokens.

### Web

`app/+html.tsx` passa a usar `#F3F3F1` no light e `#111318` no dark.

## Testes e validação

- Atualizar o snapshot de `components/__tests__/StyledText-test.js`, se a mudança em `Themed` alterar a saída.
- Adicionar testes unitários para seleção de tokens light/dark e conversão para tema de navegação.
- Manter os testes atuais de auth e helpers de Apple sem mudança de comportamento.
- Validar com:
  - `npx tsc --noEmit`
  - `npm run lint`
  - `npx jest --ci --runInBand`
  - `npx expo-doctor`
  - `npx expo install --check`
  - `sh .husky/pre-commit`
  - `npx expo export --platform web --output-dir /tmp/opencode/expo-web-theme`

## Fora de escopo

- Backend GraphQL, endpoint Apollo e formato da API.
- Mudança no contrato de sessão Apple.
- Implementação de uma rota de detalhe para Dogs.
- Testes visuais automatizados com Playwright ou screenshots.
- Commit, push ou PR.

## Critérios de aceitação

- Todas as telas e componentes visíveis usam o tema central.
- Não restam paletas locais em `sign.tsx` nem cores hardcoded nas telas refatoradas.
- A tab bar mostra apenas Entrar quando deslogado e Início/Sobre/Locais/Cães/Sair quando logado.
- A aba Sair desloga sem confirmação e retorna para Sign.
- About descreve Apple Sign In, Secure Store, Apollo GraphQL e Expo Router.
- Dogs e Locations mantêm seus dados GraphQL com estados visuais padronizados.
- Todas as validações listadas passam.
