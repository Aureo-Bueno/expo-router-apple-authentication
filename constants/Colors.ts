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
