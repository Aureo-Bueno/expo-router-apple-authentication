import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useAppTheme } from '@/theme';
import { uiStyles } from './styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
  },
});

type ScreenProps = {
  children: ReactNode;
  centered?: boolean;
  scroll?: boolean;
};

export function Screen({ children, centered = false, scroll = true }: ScreenProps) {
  const theme = useAppTheme();
  const backgroundColor = theme.colors.background;

  if (!scroll) {
    return (
      <View
        style={[
          styles.container,
          uiStyles.content,
          centered && styles.centered,
          { backgroundColor },
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor }}
      contentContainerStyle={[uiStyles.content, centered && styles.centered, { backgroundColor }]}
    >
      {children}
    </ScrollView>
  );
}
