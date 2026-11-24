# UI Theme Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Centralizar todo o estilo do app em um tema default e alinhar tabs, telas, listas e estados ao padrão visual da tela de login.

**Architecture:** Criar `theme/` com tokens e um hook `useAppTheme()` sem novo Context; criar `components/ui/` com primitives reutilizáveis; migrar root navigation, tab bar, Sign, Home, About, Dogs, Locations, modal, not-found e HTML web para consumir o mesmo tema. Correções óbvias nas listas GraphQL serão feitas no mesmo conjunto de mudanças.

**Tech Stack:** Expo SDK 58, React Native, Expo Router, React Navigation, Apollo Client 4, TypeScript 6.0.3, Biome 2.6.8, Jest com `jest-expo`.

**Spec:** `docs/superpowers/specs/2026-11-23-ui-theme-refactor-design.md`

## Global Constraints

- Não criar commits, push ou PR.
- Usar aspas simples, trailing commas e 2 espaços, conforme Biome.
- Não adicionar comentários de código.
- Toda cor, espaçamento, raio e tipografia usada nas telas refatoradas vem de `useAppTheme()`.
- Tabs deslogadas: apenas **Entrar**. Tabs logadas: **Início, Sobre, Locais, Cães, Sair**.
- A aba **Sair** chama `signOut()` diretamente, sem confirmação.
- Mensagem de erro Apple permanece `Não foi possível entrar com a Apple. Tente novamente.`
- Fallback de nome Apple permanece `usuário`.
- Testes não interativos: `npx jest --ci --runInBand`.
- Cada tarefa termina com `git diff --check`; nenhuma tarefa cria commit.

---

### Task 1: Tema central, adaptadores e testes

**Files:**

- Create: `theme/tokens.ts`
- Create: `theme/index.ts`
- Create: `theme/__tests__/theme-test.ts`
- Modify: `constants/Colors.ts`
- Modify: `components/Themed.tsx`

**Interfaces:**

- Consumes: `useColorScheme` de `@/hooks`.
- Produces: `AppTheme`, `lightTheme`, `darkTheme`, `getTheme`, `useAppTheme`, `getNavigationTheme`; `useThemeColor` passa a aceitar qualquer chave de `AppTheme['colors']`.

- [x] **Step 1: Write the failing theme test**

Create `theme/__tests__/theme-test.ts`:

```ts
import { darkTheme, getNavigationTheme, getTheme, lightTheme } from '../index';

it('selects light tokens when color scheme is null', () => {
  expect(getTheme(null)).toBe(lightTheme);
  expect(getTheme(null).colors.background).toBe('#F3F3F1');
});

it('selects dark tokens when color scheme is dark', () => {
  expect(getTheme('dark')).toBe(darkTheme);
  expect(getTheme('dark').colors.background).toBe('#111318');
});

it('maps app tokens to the React Navigation theme', () => {
  const navigationTheme = getNavigationTheme(darkTheme);

  expect(navigationTheme.dark).toBe(true);
  expect(navigationTheme.colors.primary).toBe('#2F95DC');
  expect(navigationTheme.colors.background).toBe('#111318');
  expect(navigationTheme.colors.card).toBe('#1B1E25');
  expect(navigationTheme.colors.text).toBe('#F4F5F7');
  expect(navigationTheme.colors.border).toBe('#2C313A');
  expect(navigationTheme.colors.notification).toBe('#FF8A84');
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `npx jest --ci --runInBand theme/__tests__/theme-test.ts`

Expected: FAIL with `Cannot find module '../index'`.

- [x] **Step 3: Write `theme/tokens.ts`**

```ts
export type ThemeMode = 'light' | 'dark';

export type AppTheme = {
  mode: ThemeMode;
  colors: {
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    border: string;
    primary: string;
    onPrimary: string;
    success: string;
    successBackground: string;
    error: string;
    errorBackground: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    fontFamily: string;
    title: number;
    body: number;
    bodyLineHeight: number;
    label: number;
    eyebrow: number;
  };
  shadow: {
    card: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
  };
};

const sharedTokens = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },
  typography: {
    fontFamily: 'SpaceMono',
    title: 28,
    body: 15,
    bodyLineHeight: 22,
    label: 11,
    eyebrow: 11,
  },
  shadow: {
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 20,
      elevation: 4,
    },
  },
};

export const lightTheme: AppTheme = {
  mode: 'light',
  colors: {
    background: '#F3F3F1',
    surface: '#FFFFFF',
    text: '#15171D',
    textMuted: '#6C7079',
    border: '#E3E3E0',
    primary: '#2F95DC',
    onPrimary: '#FFFFFF',
    success: '#1B7F57',
    successBackground: '#E8F5EE',
    error: '#B4443F',
    errorBackground: '#FBEAE8',
  },
  ...sharedTokens,
};

export const darkTheme: AppTheme = {
  mode: 'dark',
  colors: {
    background: '#111318',
    surface: '#1B1E25',
    text: '#F4F5F7',
    textMuted: '#9DA3AF',
    border: '#2C313A',
    primary: '#2F95DC',
    onPrimary: '#FFFFFF',
    success: '#5FD3A0',
    successBackground: '#16332A',
    error: '#FF8A84',
    errorBackground: '#3A2224',
  },
  ...sharedTokens,
};
```

- [x] **Step 4: Write `theme/index.ts`**

```ts
import { DarkTheme, DefaultTheme, type Theme as NavigationTheme } from '@react-navigation/native';
import type { ColorSchemeName } from 'react-native';
import { useColorScheme } from '@/hooks';
import { darkTheme, lightTheme, type AppTheme } from './tokens';

export * from './tokens';

export function getTheme(colorScheme: ColorSchemeName): AppTheme {
  return colorScheme === 'dark' ? darkTheme : lightTheme;
}

export function useAppTheme(): AppTheme {
  return getTheme(useColorScheme());
}

export function getNavigationTheme(theme: AppTheme): NavigationTheme {
  const base = theme.mode === 'dark' ? DarkTheme : DefaultTheme;

  return {
    ...base,
    dark: theme.mode === 'dark',
    colors: {
      ...base.colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.border,
      notification: theme.colors.error,
    },
  };
}
```

- [x] **Step 5: Replace `constants/Colors.ts`**

```ts
import { darkTheme, lightTheme } from '@/theme/tokens';

export default {
  light: {
    text: lightTheme.colors.text,
    background: lightTheme.colors.background,
    tint: lightTheme.colors.primary,
    tabIconDefault: lightTheme.colors.textMuted,
    tabIconSelected: lightTheme.colors.primary,
  },
  dark: {
    text: darkTheme.colors.text,
    background: darkTheme.colors.background,
    tint: darkTheme.colors.primary,
    tabIconDefault: darkTheme.colors.textMuted,
    tabIconSelected: darkTheme.colors.primary,
  },
};
```

- [x] **Step 6: Replace `components/Themed.tsx`**

```tsx
import type { ComponentProps } from 'react';
import { Text as DefaultText, View as DefaultView } from 'react-native';
import { useAppTheme, type AppTheme } from '@/theme';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

type ThemeColorName = keyof AppTheme['colors'];

export type TextProps = ThemeProps & ComponentProps<typeof DefaultText>;
export type ViewProps = ThemeProps & ComponentProps<typeof DefaultView>;

export function useThemeColor(props: { light?: string; dark?: string }, colorName: ThemeColorName) {
  const theme = useAppTheme();
  const colorFromProps = theme.mode === 'dark' ? props.dark : props.light;

  return colorFromProps ?? theme.colors[colorName];
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}
```

- [x] **Step 7: Run theme tests**

Run: `npx jest --ci --runInBand theme/__tests__/theme-test.ts`

Expected: PASS with 3 tests.

- [x] **Step 8: Typecheck and checkpoint**

Run: `npx tsc --noEmit && git diff --check`

Expected: no output and exit code 0.

---

### Task 2: UI primitives and removal of the accidental `/styles` route

**Files:**

- Create: `components/ui/styles.ts`
- Create: `components/ui/Screen.tsx`
- Create: `components/ui/ScreenHeader.tsx`
- Create: `components/ui/Card.tsx`
- Create: `components/ui/StateBlock.tsx`
- Create: `components/ui/ActionButton.tsx`
- Create: `components/ui/index.ts`
- Create: `components/ui/__tests__/ui-test.tsx`
- Delete: `app/(tabs)/styles.ts`

**Interfaces:**

- Consumes: `useAppTheme`, `AppTheme` from `@/theme`.
- Produces: `Screen`, `ScreenHeader`, `Card`, `StateBlock`, `ActionButton`, `uiStyles`.

- [x] **Step 1: Write the failing primitive test**

Create `components/ui/__tests__/ui-test.tsx`:

```tsx
import { Text } from 'react-native';
import { create, type ReactTestRenderer } from 'react-test-renderer';
import { ScreenHeader, StateBlock } from '../index';

function renderedTexts(tree: ReactTestRenderer) {
  return tree.root
    .findAllByType(Text)
    .map((node) => String(node.props.children))
    .join(' ');
}

it('renders ScreenHeader copy and palette text', () => {
  const tree = create(
    <ScreenHeader eyebrow="APPLE ID" title="Entre com segurança" description="Descrição" />,
  );
  const text = renderedTexts(tree);

  expect(text).toContain('APPLE ID');
  expect(text).toContain('Entre com segurança');
  expect(text).toContain('Descrição');
});

it('renders the provided StateBlock error message', () => {
  const tree = create(<StateBlock kind="error" message="Falhou" />);

  expect(renderedTexts(tree)).toContain('Falhou');
});

it('renders the default StateBlock empty message', () => {
  const tree = create(<StateBlock kind="empty" />);

  expect(renderedTexts(tree)).toContain('Nenhum item encontrado.');
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `npx jest --ci --runInBand components/ui/__tests__/ui-test.tsx`

Expected: FAIL with `Cannot find module '../index'`.

- [x] **Step 3: Write `components/ui/styles.ts`**

```ts
import { StyleSheet } from 'react-native';

export const uiStyles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    borderWidth: 1,
    padding: 28,
  },
  section: {
    gap: 12,
  },
  list: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rule: {
    width: 24,
    height: 2,
    borderRadius: 1,
  },
  divider: {
    height: 1,
  },
  status: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 2,
  },
});
```

- [x] **Step 4: Write `components/ui/Screen.tsx`**

```tsx
import type { ReactNode } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useAppTheme } from '@/theme';
import { uiStyles } from './styles';

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
  },
});

type ScreenProps = {
  children: ReactNode;
  centered?: boolean;
};

export function Screen({ children, centered = false }: ScreenProps) {
  const theme = useAppTheme();

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={[
        uiStyles.content,
        centered && styles.centered,
        { backgroundColor: theme.colors.background },
      ]}
    >
      {children}
    </ScrollView>
  );
}
```

- [x] **Step 5: Write `components/ui/ScreenHeader.tsx`**

```tsx
import { Text, View } from 'react-native';
import { useAppTheme } from '@/theme';
import { uiStyles } from './styles';

type ScreenHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function ScreenHeader({ eyebrow, title, description }: ScreenHeaderProps) {
  const theme = useAppTheme();

  return (
    <View style={uiStyles.section}>
      <View style={uiStyles.row}>
        <View style={[uiStyles.rule, { backgroundColor: theme.colors.primary }]} />
        <Text
          style={{
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.eyebrow,
            letterSpacing: 1.4,
            color: theme.colors.primary,
          }}
        >
          {eyebrow}
        </Text>
      </View>

      <Text
        style={{
          fontSize: theme.typography.title,
          fontWeight: '700',
          color: theme.colors.text,
        }}
      >
        {title}
      </Text>

      {description && (
        <Text
          style={{
            fontSize: theme.typography.body,
            lineHeight: theme.typography.bodyLineHeight,
            color: theme.colors.textMuted,
          }}
        >
          {description}
        </Text>
      )}
    </View>
  );
}
```

- [x] **Step 6: Write `components/ui/Card.tsx`**

```tsx
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';
import { useAppTheme } from '@/theme';
import { uiStyles } from './styles';

type CardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Card({ children, style }: CardProps) {
  const theme = useAppTheme();

  return (
    <View
      style={[
        uiStyles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.xl,
        },
        theme.shadow.card,
        style,
      ]}
    >
      {children}
    </View>
  );
}
```

- [x] **Step 7: Write `components/ui/StateBlock.tsx`**

```tsx
import { ActivityIndicator, Text, View } from 'react-native';
import { useAppTheme } from '@/theme';
import { Card } from './Card';
import { uiStyles } from './styles';

type StateBlockProps = {
  kind: 'loading' | 'error' | 'empty';
  message?: string;
};

export function StateBlock({ kind, message }: StateBlockProps) {
  const theme = useAppTheme();

  if (kind === 'loading') {
    return (
      <View style={[uiStyles.row, { justifyContent: 'center', paddingVertical: 24 }]}>
        <ActivityIndicator color={theme.colors.primary} />
        <Text style={{ color: theme.colors.textMuted, fontSize: theme.typography.body }}>
          {message ?? 'Carregando...'}
        </Text>
      </View>
    );
  }

  const isError = kind === 'error';
  const text =
    message ?? (isError ? 'Não foi possível carregar os dados.' : 'Nenhum item encontrado.');

  return (
    <Card
      style={{ backgroundColor: isError ? theme.colors.errorBackground : theme.colors.surface }}
    >
      <Text
        accessibilityLiveRegion="polite"
        style={{
          color: isError ? theme.colors.error : theme.colors.textMuted,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body,
          fontWeight: '600',
        }}
      >
        {text}
      </Text>
    </Card>
  );
}
```

- [x] **Step 8: Write `components/ui/ActionButton.tsx`**

```tsx
import { Pressable, Text, type StyleProp, type ViewStyle } from 'react-native';
import { useAppTheme } from '@/theme';

type ActionButtonProps = {
  label: string;
  onPress: () => void;
  accessibilityLabel?: string;
  variant?: 'primary' | 'secondary';
  style?: StyleProp<ViewStyle>;
};

export function ActionButton({
  label,
  onPress,
  accessibilityLabel,
  variant = 'primary',
  style,
}: ActionButtonProps) {
  const theme = useAppTheme();
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      style={({ pressed }) => [
        {
          alignItems: 'center',
          borderRadius: theme.radius.md,
          borderWidth: 1,
          borderColor: isPrimary ? theme.colors.primary : theme.colors.border,
          backgroundColor: isPrimary
            ? theme.colors.primary
            : pressed
              ? theme.colors.background
              : theme.colors.surface,
          opacity: pressed ? 0.8 : 1,
          paddingHorizontal: 16,
          paddingVertical: 12,
        },
        style,
      ]}
    >
      <Text
        style={{
          color: isPrimary ? theme.colors.onPrimary : theme.colors.text,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body,
          fontWeight: '600',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
```

- [x] **Step 9: Write `components/ui/index.ts`**

```ts
export * from './ActionButton';
export * from './Card';
export * from './Screen';
export * from './ScreenHeader';
export * from './StateBlock';
export * from './styles';
```

- [x] **Step 10: Delete `app/(tabs)/styles.ts`**

Run: `git rm 'app/(tabs)/styles.ts'`

Expected: file removed from working tree and index.

- [x] **Step 11: Run primitive tests**

Run: `npx jest --ci --runInBand components/ui/__tests__/ui-test.tsx`

Expected: PASS with 3 tests.

- [x] **Step 12: Typecheck and checkpoint**

Run: `npx tsc --noEmit && git diff --check`

Expected: FAIL because remaining screens still import `@/app/(tabs)/styles`. Continue to Task 5 for those imports; this failure is expected until the migration tasks are done.

---

### Task 3: Navigation theme, tab labels and Sair tab

**Files:**

- Create: `utils/tab-bar.ts`
- Create: `utils/__tests__/tab-bar-test.ts`
- Create: `components/TabBar/LogoutTabButton.tsx`
- Modify: `app/_layout.tsx`
- Modify: `app/(tabs)/_layout.tsx`
- Modify: `components/TabBarIcon/index.tsx`

**Interfaces:**

- Consumes: `useAuth`, `useClientOnlyValue` from `@/hooks`; `getNavigationTheme`, `useAppTheme` from `@/theme`; primitives from `@/components/ui`.
- Produces: `getTabLabel`, `getTabIcon`, `LogoutTabButton`; tab bar themeada com logout direto.

- [x] **Step 1: Write the failing tab-label test**

Create `utils/__tests__/tab-bar-test.ts`:

```ts
import { getTabIcon, getTabLabel } from '../tab-bar';

it('uses Entrar for the sign route when signed out', () => {
  expect(getTabLabel('sign', false)).toBe('Entrar');
  expect(getTabIcon('sign', false)).toBe('sign-in');
});

it('uses Sair for the sign route when signed in', () => {
  expect(getTabLabel('sign', true)).toBe('Sair');
  expect(getTabIcon('sign', true)).toBe('sign-out');
});

it('uses Portuguese labels for protected routes', () => {
  expect(getTabLabel('index', true)).toBe('Início');
  expect(getTabLabel('about', true)).toBe('Sobre');
  expect(getTabLabel('locations', true)).toBe('Locais');
  expect(getTabLabel('dogs', true)).toBe('Cães');
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `npx jest --ci --runInBand utils/__tests__/tab-bar-test.ts`

Expected: FAIL with `Cannot find module '../tab-bar'`.

- [x] **Step 3: Write `utils/tab-bar.ts`**

```ts
export type TabRoute = 'index' | 'about' | 'sign' | 'locations' | 'dogs';

const labels: Record<TabRoute, string> = {
  index: 'Início',
  about: 'Sobre',
  sign: 'Entrar',
  locations: 'Locais',
  dogs: 'Cães',
};

export function getTabLabel(route: TabRoute, signedIn: boolean): string {
  if (route === 'sign' && signedIn) {
    return 'Sair';
  }

  return labels[route];
}

export function getTabIcon(route: TabRoute, signedIn: boolean) {
  if (route === 'sign') {
    return signedIn ? ('sign-out' as const) : ('sign-in' as const);
  }

  if (route === 'index') {
    return 'home' as const;
  }

  if (route === 'about') {
    return 'archive' as const;
  }

  return 'list' as const;
}
```

- [x] **Step 4: Write `components/TabBar/LogoutTabButton.tsx`**

```tsx
import { Pressable, Text, type StyleProp, type ViewStyle } from 'react-native';
import { useAuth } from '@/hooks';
import { useAppTheme } from '@/theme';
import { uiStyles } from '@/components/ui';
import TabBarIcon from '@/components/TabBarIcon';

type LogoutTabButtonProps = {
  accessibilityState?: { selected?: boolean };
  style?: StyleProp<ViewStyle>;
};

export function LogoutTabButton({ accessibilityState, style }: LogoutTabButtonProps) {
  const { signOut } = useAuth();
  const theme = useAppTheme();
  const focused = accessibilityState?.selected ?? false;
  const color = focused ? theme.colors.primary : theme.colors.textMuted;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Sair da conta"
      accessibilityState={accessibilityState}
      onPress={() => void signOut()}
      style={[uiStyles.tabButton, style]}
    >
      <TabBarIcon name="sign-out" color={color} />
      <Text
        style={{
          color,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.label,
          letterSpacing: 0.3,
        }}
      >
        Sair
      </Text>
    </Pressable>
  );
}
```

- [x] **Step 5: Replace `app/_layout.tsx`**

```tsx
import { ApolloProvider } from '@apollo/client/react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { AuthProvider, useColorScheme } from '@/hooks';
import { client } from '@/services/client';
import { getNavigationTheme, useAppTheme } from '@/theme';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const theme = useAppTheme();

  return (
    <ThemeProvider value={getNavigationTheme(theme)}>
      <AuthProvider>
        <ApolloProvider client={client}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </Stack>
        </ApolloProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
```

- [x] **Step 6: Replace `components/TabBarIcon/index.tsx`**

```tsx
import { FontAwesome } from '@expo/vector-icons';
import type { ColorValue } from 'react-native';

export default function TabBarIcon({
  color,
  ...props
}: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: ColorValue;
}) {
  const iconColor = typeof color === 'number' ? undefined : (color ?? undefined);

  return <FontAwesome size={22} color={iconColor} {...props} />;
}
```

- [x] **Step 7: Replace `app/(tabs)/_layout.tsx`**

```tsx
import { router, Tabs, usePathname } from 'expo-router';
import { useEffect } from 'react';
import type { ColorValue } from 'react-native';
import { LogoutTabButton } from '@/components/TabBar/LogoutTabButton';
import { Screen, StateBlock } from '@/components/ui';
import TabBarIcon from '@/components/TabBarIcon';
import { useAuth, useClientOnlyValue } from '@/hooks';
import { useAppTheme } from '@/theme';
import { getTabIcon, getTabLabel, type TabRoute } from '@/utils/tab-bar';

export default function TabLayout() {
  const { isReady, signedIn } = useAuth();
  const pathname = usePathname();
  const theme = useAppTheme();
  const headerShown = useClientOnlyValue(false, true);

  useEffect(() => {
    if (isReady && !signedIn && !pathname.endsWith('/sign')) {
      router.replace('/(tabs)/sign');
    }
  }, [isReady, pathname, signedIn]);

  if (!isReady) {
    return (
      <Screen centered>
        <StateBlock kind="loading" message="Carregando sessão..." />
      </Screen>
    );
  }

  const lockedHref = signedIn ? undefined : null;
  const activeColor = theme.colors.primary;
  const inactiveColor = theme.colors.textMuted;

  const tabOptions = (route: TabRoute) => ({
    href: route === 'sign' ? undefined : lockedHref,
    label: getTabLabel(route, signedIn),
    tabBarIcon: ({ color }: { color: ColorValue }) => (
      <TabBarIcon name={getTabIcon(route, signedIn)} color={color} />
    ),
  });

  return (
    <Tabs
      screenOptions={{
        headerShown,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarLabelStyle: {
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.label,
          letterSpacing: 0.3,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 0,
        },
      }}
    >
      <Tabs.Screen name="index" options={tabOptions('index')} />
      <Tabs.Screen name="about" options={tabOptions('about')} />
      <Tabs.Screen
        name="sign"
        options={{
          ...tabOptions('sign'),
          tabBarButton: signedIn ? LogoutTabButton : undefined,
        }}
      />
      <Tabs.Screen name="locations" options={tabOptions('locations')} />
      <Tabs.Screen name="dogs" options={tabOptions('dogs')} />
    </Tabs>
  );
}
```

- [x] **Step 8: Run tab-label tests**

Run: `npx jest --ci --runInBand utils/__tests__/tab-bar-test.ts`

Expected: PASS with 3 tests.

- [x] **Step 9: Typecheck and checkpoint**

Run: `npx tsc --noEmit && git diff --check`

Expected: FAIL while old screens still import the deleted styles file. Continue to Tasks 4-7.

---

### Task 4: Sign, Home and About screens

**Files:**

- Create: `utils/about-copy.ts`
- Create: `utils/__tests__/about-copy-test.ts`
- Modify: `app/(tabs)/sign.tsx`
- Modify: `app/(tabs)/index.tsx`
- Modify: `app/(tabs)/about.tsx`

**Interfaces:**

- Consumes: `useAuth` from `@/hooks`; primitives from `@/components/ui`; Apple auth helpers from `@/services/apple-auth`.
- Produces: `aboutDescription`, `aboutTopics`; telas Sign/Home/About themeadas.

- [x] **Step 1: Write the failing About copy test**

Create `utils/__tests__/about-copy-test.ts`:

```ts
import { aboutDescription, aboutTopics } from '../about-copy';

it('describes authentication, storage and GraphQL', () => {
  expect(aboutDescription).toContain('autenticação com Apple');
  expect(aboutDescription).toContain('GraphQL');

  const titles = aboutTopics.map((topic) => topic.title);
  expect(titles).toEqual(['Apple Sign In', 'Secure Store', 'Apollo GraphQL', 'Expo Router']);
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `npx jest --ci --runInBand utils/__tests__/about-copy-test.ts`

Expected: FAIL with `Cannot find module '../about-copy'`.

- [x] **Step 3: Write `utils/about-copy.ts`**

```ts
export const aboutDescription =
  'Este projeto demonstra autenticação com Apple usando expo-apple-authentication, sessão persistida com expo-secure-store, navegação com Expo Router e consultas GraphQL com Apollo Client.';

export const aboutTopics = [
  {
    title: 'Apple Sign In',
    description: 'Login nativo com Apple e scopes de nome e e-mail.',
  },
  {
    title: 'Secure Store',
    description: 'Sessão salva apenas neste dispositivo.',
  },
  {
    title: 'Apollo GraphQL',
    description: 'Consultas de Dogs e Locations com estados de carregamento e erro.',
  },
  {
    title: 'Expo Router',
    description: 'Layouts de stack, tabs, modal e rota não encontrada.',
  },
];
```

- [x] **Step 4: Replace `app/(tabs)/sign.tsx`**

```tsx
import * as AppleAuthentication from 'expo-apple-authentication';
import { useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { ActionButton, Card, Screen, ScreenHeader, uiStyles } from '@/components/ui';
import { useAuth } from '@/hooks';
import { getAppleSignInErrorMessage, getDisplayName } from '@/services/apple-auth';
import { useAppTheme } from '@/theme';

export default function TabSignScreen() {
  const { displayName, signIn, signOut, signedIn } = useAuth();
  const theme = useAppTheme();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (loading) {
      return;
    }

    setErrorMessage(null);
    setLoading(true);

    try {
      const credentials = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      await signIn(getDisplayName(credentials.fullName));
    } catch (error) {
      const message = getAppleSignInErrorMessage(error);

      if (message) {
        setErrorMessage(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setErrorMessage(null);
    await signOut();
  };

  const welcomeMessage = signedIn ? `Bem-vindo, ${displayName ?? 'usuário'}!` : null;
  const visibleMessage = welcomeMessage ?? errorMessage;

  return (
    <Screen centered>
      <Card>
        <ScreenHeader
          eyebrow="APPLE ID"
          title="Entre com segurança"
          description="Use sua Apple ID para entrar. A sessão fica salva apenas neste dispositivo."
        />

        {!signedIn && (
          <>
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={theme.radius.md}
              style={{
                width: '100%',
                height: 48,
                marginTop: theme.spacing.xl,
                opacity: loading ? 0.6 : 1,
              }}
              onPress={handleSignIn}
            />
            {loading && (
              <View style={{ alignItems: 'center', marginTop: theme.spacing.md }}>
                <ActivityIndicator color={theme.colors.primary} />
              </View>
            )}
          </>
        )}

        {visibleMessage && (
          <View
            style={[
              uiStyles.status,
              {
                backgroundColor: welcomeMessage
                  ? theme.colors.successBackground
                  : theme.colors.errorBackground,
                marginTop: theme.spacing.xl,
              },
            ]}
          >
            <Text
              accessibilityLiveRegion="polite"
              style={{
                color: welcomeMessage ? theme.colors.success : theme.colors.error,
                fontFamily: theme.typography.fontFamily,
                fontSize: theme.typography.body,
                fontWeight: '600',
              }}
            >
              {visibleMessage}
            </Text>
          </View>
        )}

        {signedIn && (
          <View style={{ marginTop: theme.spacing.xl }}>
            <ActionButton label="Sair" onPress={handleSignOut} variant="secondary" />
          </View>
        )}
      </Card>
    </Screen>
  );
}
```

- [x] **Step 5: Replace `app/(tabs)/index.tsx`**

```tsx
import { router } from 'expo-router';
import { View } from 'react-native';
import { ActionButton, Card, Screen, ScreenHeader, uiStyles } from '@/components/ui';
import { useAuth } from '@/hooks';
import { useAppTheme } from '@/theme';

export default function TabHomeScreen() {
  const { displayName } = useAuth();
  const theme = useAppTheme();

  return (
    <Screen centered>
      <Card>
        <ScreenHeader
          eyebrow="APPLE ID"
          title={`Olá, ${displayName ?? 'usuário'}!`}
          description="Sua sessão Apple está ativa neste dispositivo. Escolha uma seção para continuar."
        />

        <View style={[uiStyles.list, { marginTop: theme.spacing.xl }]}>
          <ActionButton label="Ver cães" onPress={() => router.push('/(tabs)/dogs')} />
          <ActionButton
            label="Ver locais"
            onPress={() => router.push('/(tabs)/locations')}
            variant="secondary"
          />
          <ActionButton
            label="Sobre o projeto"
            onPress={() => router.push('/(tabs)/about')}
            variant="secondary"
          />
        </View>
      </Card>
    </Screen>
  );
}
```

- [x] **Step 6: Replace `app/(tabs)/about.tsx`**

```tsx
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { ActionButton, Card, Screen, ScreenHeader, uiStyles } from '@/components/ui';
import { useAppTheme } from '@/theme';
import { aboutDescription, aboutTopics } from '@/utils/about-copy';

export default function TabAboutScreen() {
  const theme = useAppTheme();

  return (
    <Screen centered>
      <Card>
        <ScreenHeader
          eyebrow="SOBRE O PROJETO"
          title="Autenticação Apple + GraphQL"
          description={aboutDescription}
        />

        <View style={[uiStyles.list, { marginTop: theme.spacing.xl }]}>
          {aboutTopics.map((topic) => (
            <Card key={topic.title} style={{ padding: theme.spacing.lg, shadowOpacity: 0 }}>
              <Text
                style={{
                  color: theme.colors.text,
                  fontFamily: theme.typography.fontFamily,
                  fontSize: theme.typography.body,
                  fontWeight: '600',
                }}
              >
                {topic.title}
              </Text>
              <Text
                style={{
                  color: theme.colors.textMuted,
                  fontSize: theme.typography.body,
                  lineHeight: theme.typography.bodyLineHeight,
                  marginTop: theme.spacing.xs,
                }}
              >
                {topic.description}
              </Text>
            </Card>
          ))}
        </View>

        <View style={{ marginTop: theme.spacing.xl }}>
          <ActionButton
            label="Abrir modal"
            onPress={() => router.push('/modal')}
            variant="secondary"
          />
        </View>
      </Card>
    </Screen>
  );
}
```

- [x] **Step 7: Run About copy tests**

Run: `npx jest --ci --runInBand utils/__tests__/about-copy-test.ts`

Expected: PASS with 1 test.

- [x] **Step 8: Typecheck and checkpoint**

Run: `npx tsc --noEmit && git diff --check`

Expected: FAIL while Dogs/Locations still import the deleted styles file. Continue to Tasks 5-6.

---

### Task 5: GraphQL Dogs query, list and detail component

**Files:**

- Create: `components/DogsList/__tests__/graphql-test.ts`
- Modify: `components/DogsList/graphql.ts`
- Modify: `components/DogsList/index.tsx`
- Modify: `components/DogsList/DogDescription/index.tsx`

**Interfaces:**

- Consumes: `useQuery` from `@apollo/client/react`; primitives from `@/components/ui`; `useAppTheme` from `@/theme`.
- Produces: `GET_DOGS_QUERY` with `breed`; themeados `DogsList` e `DogDescription`.

- [x] **Step 1: Write the failing GraphQL test**

Create `components/DogsList/__tests__/graphql-test.ts`:

```ts
import { print } from 'graphql';
import { GET_DOGS_QUERY } from '../graphql';

it('requests breed for each dog', () => {
  expect(print(GET_DOGS_QUERY)).toContain('breed');
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `npx jest --ci --runInBand components/DogsList/__tests__/graphql-test.ts`

Expected: FAIL with `Expected substring: "breed"`.

- [x] **Step 3: Add `breed` to `components/DogsList/graphql.ts`**

```ts
import { gql, type TypedDocumentNode } from '@apollo/client';
import type { DogsData } from '@/types';

export const GET_DOGS_QUERY: TypedDocumentNode<DogsData, Record<string, never>> = gql`
  query GetDogs {
    dogs {
      id
      name
      breed
    }
  }
`;
```

- [x] **Step 4: Run GraphQL test**

Run: `npx jest --ci --runInBand components/DogsList/__tests__/graphql-test.ts`

Expected: PASS with 1 test.

- [x] **Step 5: Replace `components/DogsList/index.tsx`**

```tsx
import { useQuery } from '@apollo/client/react';
import { FlatList, Text, View } from 'react-native';
import { ActionButton, Card, StateBlock, uiStyles } from '@/components/ui';
import { useAppTheme } from '@/theme';
import { GET_DOGS_QUERY } from './graphql';

export function DogsList() {
  const theme = useAppTheme();
  const { loading, error, data, refetch } = useQuery(GET_DOGS_QUERY);

  if (loading) {
    return <StateBlock kind="loading" message="Carregando cães..." />;
  }

  if (error) {
    return <StateBlock kind="error" message="Não foi possível carregar os cães." />;
  }

  if (!data?.dogs?.length) {
    return <StateBlock kind="empty" message="Nenhum cão encontrado." />;
  }

  return (
    <View style={uiStyles.list}>
      <ActionButton label="Recarregar" onPress={() => void refetch()} variant="secondary" />

      <FlatList
        data={data.dogs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={{ marginBottom: theme.spacing.md }}>
            <Text
              style={{
                color: theme.colors.text,
                fontFamily: theme.typography.fontFamily,
                fontSize: theme.typography.body,
                fontWeight: '600',
              }}
            >
              {item.name}
            </Text>
            <Text
              style={{
                color: theme.colors.textMuted,
                fontSize: theme.typography.body,
                lineHeight: theme.typography.bodyLineHeight,
                marginTop: theme.spacing.xs,
              }}
            >
              {item.breed}
            </Text>
            <Text
              style={{
                color: theme.colors.textMuted,
                fontFamily: theme.typography.fontFamily,
                fontSize: theme.typography.label,
                marginTop: theme.spacing.sm,
              }}
            >
              {item.id}
            </Text>
          </Card>
        )}
      />
    </View>
  );
}
```

- [x] **Step 6: Replace `components/DogsList/DogDescription/index.tsx`**

```tsx
import { useQuery } from '@apollo/client/react';
import { Text } from 'react-native';
import { Card, StateBlock } from '@/components/ui';
import { useAppTheme } from '@/theme';
import { GET_DOG_QUERY } from './graphql';

export interface DogDescriptionProps {
  dogId: string;
}

export function DogDescription({ dogId }: DogDescriptionProps) {
  const theme = useAppTheme();
  const { loading, error, data } = useQuery(GET_DOG_QUERY, {
    variables: { id: dogId },
  });

  if (loading) {
    return <StateBlock kind="loading" message="Carregando detalhes..." />;
  }

  if (error) {
    return <StateBlock kind="error" message="Não foi possível carregar os detalhes." />;
  }

  if (!data?.dog) {
    return <StateBlock kind="empty" message="Cão não encontrado." />;
  }

  return (
    <Card>
      <Text
        style={{
          color: theme.colors.text,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body,
          fontWeight: '600',
        }}
      >
        {data.dog.name}
      </Text>
      <Text
        style={{
          color: theme.colors.textMuted,
          fontSize: theme.typography.body,
          lineHeight: theme.typography.bodyLineHeight,
          marginTop: theme.spacing.xs,
        }}
      >
        {data.dog.breed}
      </Text>
      <Text
        style={{
          color: theme.colors.textMuted,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.label,
          marginTop: theme.spacing.sm,
        }}
      >
        {data.dog.id}
      </Text>
    </Card>
  );
}
```

- [x] **Step 7: Run Dogs tests, typecheck and checkpoint**

Run: `npx jest --ci --runInBand components/DogsList/__tests__/graphql-test.ts && git diff --check`

Expected: PASS with no whitespace errors. Typecheck remains deferred until Task 6 removes the last old styles import.

---

### Task 6: Locations list and location card

**Files:**

- Modify: `components/LocationsList/index.tsx`
- Modify: `components/LocationsList/RenderLocations/index.tsx`
- Modify: `app/(tabs)/dogs.tsx`
- Modify: `app/(tabs)/locations.tsx`

**Interfaces:**

- Consumes: `useQuery` from `@apollo/client/react`; primitives from `@/components/ui`; `useAppTheme` from `@/theme`.
- Produces: themeados `LocationsList`, `RenderLocations`, `TabDogsScreen` e `TabLocationsScreen`.

- [x] **Step 1: Write the failing screen-header test**

Create `app/(tabs)/__tests__/screen-copy-test.tsx`:

```tsx
import { act } from 'react';
import { Text } from 'react-native';
import { create, type ReactTestRenderer } from 'react-test-renderer';
import DogsScreen from '../dogs';
import LocationsScreen from '../locations';

jest.mock('@apollo/client/react', () => ({
  useQuery: () => ({
    loading: true,
    error: undefined,
    data: undefined,
    refetch: jest.fn(),
  }),
}));

function renderedTexts(tree: ReactTestRenderer) {
  return tree.root
    .findAllByType(Text)
    .map((node) => String(node.props.children))
    .join(' ');
}

it('uses the themed Dogs header copy', () => {
  let tree!: ReactTestRenderer;

  act(() => {
    tree = create(<DogsScreen />);
  });
  const text = renderedTexts(tree);

  expect(text).toContain('GRAPHQL');
  expect(text).toContain('Raças de cães');
});

it('uses the themed Locations header copy', () => {
  let tree!: ReactTestRenderer;

  act(() => {
    tree = create(<LocationsScreen />);
  });
  const text = renderedTexts(tree);

  expect(text).toContain('GRAPHQL');
  expect(text).toContain('Localizações');
});
```

Adaptação de harness aceita: `create(...)` fica envolvido em `act(...)` porque React 19 agenda o render fora do corpo do teste sem ele; as props e asserções permanecem as mesmas.

- [x] **Step 2: Run test to verify it fails**

Run: `npx jest --ci --runInBand --runTestsByPath "app/(tabs)/__tests__/screen-copy-test.tsx"`

Adaptação de harness aceita: o caminho com `(tabs)` sem `--runTestsByPath` e aspas falha neste shell, então o alvo é passado como caminho literal entre aspas.

Expected: FAIL because the current screens render `List Dogs Types` and `List Locations`.

- [x] **Step 3: Replace `app/(tabs)/dogs.tsx`**

```tsx
import { DogsList } from '@/components/DogsList';
import { Card, Screen, ScreenHeader } from '@/components/ui';

export default function TabDogsScreen() {
  return (
    <Screen>
      <Card>
        <ScreenHeader
          eyebrow="GRAPHQL"
          title="Raças de cães"
          description="Dados de cães carregados pela API GraphQL com estados de carregamento, erro e recarga."
        />
        <DogsList />
      </Card>
    </Screen>
  );
}
```

- [x] **Step 4: Replace `app/(tabs)/locations.tsx`**

```tsx
import { LocationsList } from '@/components/LocationsList';
import { Card, Screen, ScreenHeader } from '@/components/ui';

export default function TabLocationsScreen() {
  return (
    <Screen>
      <Card>
        <ScreenHeader
          eyebrow="GRAPHQL"
          title="Localizações"
          description="Locais carregados pela API GraphQL, com descrição e imagem em cards themeados."
        />
        <LocationsList />
      </Card>
    </Screen>
  );
}
```

- [x] **Step 5: Replace `components/LocationsList/index.tsx`**

```tsx
import { useQuery } from '@apollo/client/react';
import { FlatList, View } from 'react-native';
import { ActionButton, StateBlock, uiStyles } from '@/components/ui';
import { useAppTheme } from '@/theme';
import { GET_LOCATIONS } from './graphql';
import { RenderLocations } from './RenderLocations';

export function LocationsList() {
  const theme = useAppTheme();
  const { loading, error, data, refetch } = useQuery(GET_LOCATIONS);

  if (loading) {
    return <StateBlock kind="loading" message="Carregando localizações..." />;
  }

  if (error) {
    return <StateBlock kind="error" message="Não foi possível carregar as localizações." />;
  }

  if (!data?.locations?.length) {
    return <StateBlock kind="empty" message="Nenhuma localização encontrada." />;
  }

  return (
    <View style={uiStyles.list}>
      <ActionButton label="Recarregar" onPress={() => void refetch()} variant="secondary" />

      <FlatList
        data={data.locations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RenderLocations {...item} />}
        ItemSeparatorComponent={() => (
          <View style={[uiStyles.divider, { backgroundColor: theme.colors.border }]} />
        )}
      />
    </View>
  );
}
```

- [x] **Step 6: Replace `components/LocationsList/RenderLocations/index.tsx`**

```tsx
import { Image, Text } from 'react-native';
import { Card } from '@/components/ui';
import { useAppTheme } from '@/theme';
import type { ILocations } from '@/types';

export function RenderLocations({ name, description, photo }: ILocations) {
  const theme = useAppTheme();

  return (
    <Card>
      <Text
        style={{
          color: theme.colors.text,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body,
          fontWeight: '600',
        }}
      >
        {name}
      </Text>

      <Text
        style={{
          color: theme.colors.textMuted,
          fontSize: theme.typography.body,
          lineHeight: theme.typography.bodyLineHeight,
          marginTop: theme.spacing.xs,
        }}
      >
        {description}
      </Text>

      <Image
        source={{ uri: photo }}
        style={{
          width: '100%',
          height: 160,
          borderRadius: theme.radius.md,
          backgroundColor: theme.colors.border,
          marginTop: theme.spacing.md,
        }}
      />
    </Card>
  );
}
```

- [x] **Step 7: Run screen-copy tests**

Run: `npx jest --ci --runInBand --runTestsByPath "app/(tabs)/__tests__/screen-copy-test.tsx"`

Expected: PASS with 2 tests.

- [x] **Step 8: Typecheck and checkpoint**

Run: `npx tsc --noEmit && git diff --check`

Expected: no output and exit code 0.

---

### Task 7: Modal, not-found and web background

**Files:**

- Modify: `app/modal.tsx`
- Modify: `app/+not-found.tsx`
- Modify: `app/+html.tsx`

**Interfaces:**

- Consumes: `router` from `expo-router`; primitives from `@/components/ui`.
- Produces: modal e 404 themeados e background web com as cores do tema.

- [x] **Step 1: Replace `app/modal.tsx`**

```tsx
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { ActionButton, Card, Screen, ScreenHeader } from '@/components/ui';
import { useAppTheme } from '@/theme';

export default function ModalScreen() {
  const theme = useAppTheme();

  return (
    <Screen centered>
      <Card>
        <ScreenHeader
          eyebrow="EXPO ROUTER"
          title="Modal"
          description="Esta é uma rota modal do app, agora com o mesmo estilo das demais telas."
        />
        <ActionButton
          label="Voltar"
          onPress={() => router.back()}
          variant="secondary"
          style={{ marginTop: theme.spacing.xl }}
        />
      </Card>
      <StatusBar
        style={Platform.OS === 'ios' ? (theme.mode === 'dark' ? 'light' : 'dark') : 'auto'}
      />
    </Screen>
  );
}
```

- [x] **Step 2: Replace `app/+not-found.tsx`**

```tsx
import { router, Stack } from 'expo-router';
import { ActionButton, Card, Screen, ScreenHeader } from '@/components/ui';
import { useAppTheme } from '@/theme';

export default function NotFoundScreen() {
  const theme = useAppTheme();

  return (
    <>
      <Stack.Screen options={{ title: 'Página não encontrada' }} />
      <Screen centered>
        <Card>
          <ScreenHeader
            eyebrow="ERRO 404"
            title="Página não encontrada"
            description="A rota que você tentou abrir não existe neste app."
          />
          <ActionButton
            label="Voltar para o início"
            onPress={() => router.replace('/(tabs)')}
            style={{ marginTop: theme.spacing.xl }}
          />
        </Card>
      </Screen>
    </>
  );
}
```

- [x] **Step 3: Replace `app/+html.tsx`**

```tsx
import { ScrollViewStyleReset } from 'expo-router/html';

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const responsiveBackground = `
body {
  background-color: #F3F3F1;
}
@media (prefers-color-scheme: dark) {
  body {
    background-color: #111318;
  }
}`;
```

- [x] **Step 4: Typecheck and checkpoint**

Run: `npx tsc --noEmit && git diff --check`

Expected: no output and exit code 0.

---

### Task 8: Full validation

**Files:**

- No source files are expected to change in this task, except the Biome snapshot if the StyledText snapshot needs updating.

**Interfaces:**

- Consumes: all artifacts from Tasks 1-7.
- Produces: validation evidence for the complete refactor.

- [x] **Step 1: Run the StyledText snapshot test**

Run: `npx jest --ci --runInBand components/__tests__/StyledText-test.js`

Expected: PASS. If it fails only because of the expected `Themed` change, run `npx jest --ci --runInBand components/__tests__/StyledText-test.js -u` and then rerun the same test until it passes.

- [x] **Step 2: Run all unit tests**

Run: `npx jest --ci --runInBand`

Expected: PASS with all suites.

- [x] **Step 3: Run static checks**

Run: `npx tsc --noEmit && npm run lint && git diff --check`

Expected: no output and exit code 0.

- [x] **Step 4: Run Expo checks**

Run: `npx expo-doctor && npx expo install --check`

Expected: `20/20 checks passed` and `Dependencies are up to date`.

- [x] **Step 5: Run pre-commit hook**

Run: `sh .husky/pre-commit`

Expected: Biome check passes.

- [x] **Step 6: Run web export**

Run: `npx expo export --platform web --output-dir /tmp/opencode/expo-web-theme`

Expected: `Exported: /tmp/opencode/expo-web-theme` with no errors.

- [x] **Step 7: Confirm no accidental route**

Run: `npx expo export --platform web --output-dir /tmp/opencode/expo-web-theme-routes >/dev/null && node -e "const fs=require('fs'); const dir='/tmp/opencode/expo-web-theme-routes/_expo/static/js/web'; const hasStyles=fs.existsSync(dir) && fs.readdirSync(dir).some((file) => file.startsWith('styles-')); if (hasStyles) process.exit(1);"`

Expected: exit code 0, proving `app/(tabs)/styles.ts` no longer generates a `/styles` route bundle.

- [x] **Step 8: Final checkpoint without commit**

Run: `git status --short && git diff --check`

Expected: modified/untracked files listed, no whitespace errors, no commit created.
