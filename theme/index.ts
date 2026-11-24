import { DarkTheme, DefaultTheme, type Theme as NavigationTheme } from '@react-navigation/native';
import type { ColorSchemeName } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { type AppTheme, darkTheme, lightTheme } from './tokens';

export * from './tokens';

export function getTheme(colorScheme: ColorSchemeName | null): AppTheme {
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
