# Expo Router Apple Authentication

[Português](#português) · [English](#english)

## Português

Aplicativo Expo Router que demonstra login com Apple, sessão local, navegação por tabs e consultas GraphQL com Apollo Client.

### O que o projeto faz

- Abre a tela de login com o botão nativo da Apple e pede os scopes de nome e e-mail.
- Salva o nome exibido no Secure Store e mantém a sessão depois de reiniciar o app.
- Esconde as tabs protegidas até o usuário entrar e redireciona para a tela de login.
- Mostra **Início**, **Sobre**, **Locais**, **Cães** e **Sair** depois do login.
- Consulta dados GraphQL com estados de carregamento, erro, vazio e recarga.
- Aplica tema claro e escuro em telas, nav bar, cards, botões e textos.

### Telas e rotas

| Rota                       | Finalidade                                                         |
| -------------------------- | ------------------------------------------------------------------ |
| `app/(tabs)/index.tsx`     | Saudação com o nome da sessão e atalhos para Cães, Locais e Sobre. |
| `app/(tabs)/sign.tsx`      | Login com Apple, mensagem de boas-vindas ou erro, e botão Sair.    |
| `app/(tabs)/dogs.tsx`      | Lista de cães em `FlatList`, com botão Recarregar.                 |
| `app/(tabs)/locations.tsx` | Lista de locais em `FlatList`, com botão Recarregar.               |
| `app/(tabs)/about.tsx`     | Explica Apple Sign In, Secure Store, Apollo GraphQL e Expo Router. |
| `app/modal.tsx`            | Modal tema com botão Voltar.                                       |
| `app/+not-found.tsx`       | Rota 404 com link para o início.                                   |

### Autenticação e sessão

O botão Apple usa `expo-apple-authentication`. O app pede `FULL_NAME` e `EMAIL`, converte o nome recebido em texto de saudação e trata cancelamento sem mensagem de erro. Outros erros mostram `Não foi possível entrar com a Apple. Tente novamente.`

`services/auth.ts` guarda `{ displayName }` na chave `apple_sign_in_session` do Secure Store. `hooks/useAuth.tsx` carrega essa sessão na inicialização, expõe `signIn` e `signOut`, e informa o estado `signedIn` para o layout das tabs. O projeto não envia credenciais para um backend.

### Dados GraphQL

`services/client.ts` cria o `ApolloClient` com `InMemoryCache` e dois caminhos:

- `GetDogs` usa um link Apollo local com três cães de demonstração: Rex, Mia e Bolt. Esse fluxo não faz requisição de rede.
- As outras operações usam `HttpLink` para `https://flyby-router-demo.herokuapp.com/`. A tela de Locais consome esse endpoint com a query `GetLocations`.

As duas listas usam `useQuery`, mostram estados de carregamento, erro e lista vazia, e chamam `refetch()` no botão Recarregar.

### Tema e componentes

`theme/tokens.ts` define cores, espaçamento, tipografia, raio, sombra e medidas da tab bar para os temas claro e escuro. `theme/index.ts` expõe `getTheme`, `useAppTheme` e `getNavigationTheme`.

`components/ui/` concentra os primitives usados pelas telas: `Screen`, `Card`, `ScreenHeader`, `StateBlock` e `ActionButton`. `hooks/useColorScheme.web.ts` acompanha a preferência do sistema no web. Componentes antigos em `components/Themed.tsx` e `constants/Colors.ts` mantêm compatibilidade com o template inicial.

### Requisitos

- Node.js e npm compatíveis com Expo SDK 58.
- Dispositivo ou simulador iOS para testar o botão Apple Sign In.
- Conexão de rede para carregar Locais.

### Instalação e execução

```bash
npm install
npx expo start
```

Outros comandos de execução:

```bash
npx expo start --ios
npx expo start --android
npx expo start --web
```

Use `npx expo start --clear` quando o Metro servir um bundle antigo.

### Scripts e verificações

| Comando             | O que faz                               |
| ------------------- | --------------------------------------- |
| `npm start`         | Inicia o Expo Dev Server.               |
| `npm run ios`       | Inicia o app no iOS.                    |
| `npm run android`   | Inicia o app no Android.                |
| `npm run web`       | Inicia a versão web.                    |
| `npm test`          | Inicia Jest em modo watch.              |
| `npm run lint`      | Executa Biome check.                    |
| `npm run lint:fix`  | Aplica correções do Biome.              |
| `npm run format`    | Formata arquivos com Biome.             |
| `npm run typecheck` | Executa TypeScript sem emitir arquivos. |

Verificação usada no projeto:

```bash
npx jest --ci --runInBand
npx tsc --noEmit
npm run lint
npx expo export --platform web --output-dir dist --clear
```

### Estrutura

```text
app/
  (tabs)/          rotas das tabs e testes de tela
  +html.tsx        shell HTML do web
  +not-found.tsx   rota 404
  _layout.tsx      providers, fontes e stack root
components/
  DogsList/        query, lista e detalhe de cães
  LocationsList/   query e lista de locais
  TabBar/          botão customizado de Sair
  ui/              primitives de interface
hooks/             AuthProvider, color scheme e hooks de compatibilidade
services/          sessão, Apple Sign In e Apollo Client
theme/             tokens e hooks de tema
types/             tipos de Dogs e Locations
utils/             cópias e helpers de UI
```

### Notas

- O web usa saída estática com Metro, configurada em `app.json`.
- `tsconfig.json` define o alias `@/*` para a raiz do projeto e habilita typed routes.
- `.husky/pre-commit` executa `npm run lint`.
- Os testes cobrem auth, sessão, Apple Sign In, links Apollo, tema, tabs, cópias das telas e comportamento das listas.

## English

An Expo Router app that demonstrates Apple sign-in, local session state, tab navigation, and GraphQL queries with Apollo Client.

### What the app does

- Opens the native Apple sign-in button and requests name and email scopes.
- Stores the display name in Secure Store and keeps the session after a restart.
- Hides protected tabs until the user signs in and redirects to the sign-in screen.
- Shows **Home**, **About**, **Locations**, **Dogs**, and **Sign out** after sign-in.
- Runs GraphQL queries with loading, error, empty, and refetch states.
- Applies a light and dark theme to screens, navigation, cards, buttons, and text.

### Screens and routes

| Route                      | Purpose                                                                     |
| -------------------------- | --------------------------------------------------------------------------- |
| `app/(tabs)/index.tsx`     | Greeting with the session name and shortcuts to Dogs, Locations, and About. |
| `app/(tabs)/sign.tsx`      | Apple sign-in, welcome or error message, and Sign out button.               |
| `app/(tabs)/dogs.tsx`      | Dog list in a `FlatList`, with a Reload button.                             |
| `app/(tabs)/locations.tsx` | Location list in a `FlatList`, with a Reload button.                        |
| `app/(tabs)/about.tsx`     | Explains Apple Sign In, Secure Store, Apollo GraphQL, and Expo Router.      |
| `app/modal.tsx`            | Themed modal with a Back button.                                            |
| `app/+not-found.tsx`       | 404 route with a link to the home screen.                                   |

### Authentication and session

The Apple button uses `expo-apple-authentication`. The app requests `FULL_NAME` and `EMAIL`, turns the returned name into a greeting, and treats cancellation as a silent result. Other errors show `Não foi possível entrar com a Apple. Tente novamente.`

`services/auth.ts` stores `{ displayName }` under the `apple_sign_in_session` key in Secure Store. `hooks/useAuth.tsx` loads that session on startup, exposes `signIn` and `signOut`, and shares the `signedIn` state with the tab layout. The app sends credentials to no backend.

### GraphQL data

`services/client.ts` creates the `ApolloClient` with `InMemoryCache` and two paths:

- `GetDogs` uses a local Apollo link with three demo dogs: Rex, Mia, and Bolt. This flow makes no network request.
- Other operations use `HttpLink` to `https://flyby-router-demo.herokuapp.com/`. The Locations screen uses that endpoint through the `GetLocations` query.

Both lists use `useQuery`, render loading, error, empty, and data states, and call `refetch()` from the Reload button.

### Theme and components

`theme/tokens.ts` defines colors, spacing, typography, radius, shadow, and tab bar measurements for light and dark themes. `theme/index.ts` exposes `getTheme`, `useAppTheme`, and `getNavigationTheme`.

`components/ui/` holds the primitives used by the screens: `Screen`, `Card`, `ScreenHeader`, `StateBlock`, and `ActionButton`. `hooks/useColorScheme.web.ts` follows the system preference on web. Older components in `components/Themed.tsx` and `constants/Colors.ts` keep compatibility with the starter template.

### Requirements

- Node.js and npm supported by Expo SDK 58.
- An iOS device or simulator to test the Apple sign-in button.
- Network access to load Locations.

### Install and run

```bash
npm install
npx expo start
```

Other run commands:

```bash
npx expo start --ios
npx expo start --android
npx expo start --web
```

Run `npx expo start --clear` when Metro serves an old bundle.

### Scripts and checks

| Command             | What it does                            |
| ------------------- | --------------------------------------- |
| `npm start`         | Starts the Expo Dev Server.             |
| `npm run ios`       | Starts the app on iOS.                  |
| `npm run android`   | Starts the app on Android.              |
| `npm run web`       | Starts the web app.                     |
| `npm test`          | Starts Jest in watch mode.              |
| `npm run lint`      | Runs Biome check.                       |
| `npm run lint:fix`  | Applies Biome fixes.                    |
| `npm run format`    | Formats files with Biome.               |
| `npm run typecheck` | Runs TypeScript without emitting files. |

Checks used in the project:

```bash
npx jest --ci --runInBand
npx tsc --noEmit
npm run lint
npx expo export --platform web --output-dir dist --clear
```

### Structure

```text
app/
  (tabs)/          tab routes and screen tests
  +html.tsx        web HTML shell
  +not-found.tsx   404 route
  _layout.tsx      providers, fonts, and root stack
components/
  DogsList/        dog query, list, and detail
  LocationsList/   location query and list
  TabBar/          custom Sign out button
  ui/              UI primitives
hooks/             AuthProvider, color scheme, and compatibility hooks
services/          session, Apple Sign In, and Apollo Client
theme/             theme tokens and hooks
types/             Dog and Location types
utils/             copy and UI helpers
```

### Notes

- Web uses static output with Metro, configured in `app.json`.
- `tsconfig.json` sets the `@/*` alias to the project root and enables typed routes.
- `.husky/pre-commit` runs `npm run lint`.
- Tests cover auth, session, Apple Sign In, Apollo links, theme, tabs, screen copy, and list behavior.
