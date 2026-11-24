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
