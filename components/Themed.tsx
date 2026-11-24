import type { ComponentProps } from 'react';
import { Text as DefaultText, View as DefaultView } from 'react-native';
import { type AppTheme, useAppTheme } from '@/theme';

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
