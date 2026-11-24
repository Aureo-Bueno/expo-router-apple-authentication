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
  layout: {
    tabBarHeight: number;
    tabBarPaddingBottom: number;
    tabBarLetterSpacing: number;
    tabIconSize: number;
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
  layout: {
    tabBarHeight: 64,
    tabBarPaddingBottom: 0,
    tabBarLetterSpacing: 0.3,
    tabIconSize: 22,
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
