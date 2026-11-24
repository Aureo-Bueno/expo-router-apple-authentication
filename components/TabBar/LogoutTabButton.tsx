import { Pressable, type StyleProp, Text, type ViewStyle } from 'react-native';
import TabBarIcon from '@/components/TabBarIcon';
import { uiStyles } from '@/components/ui';
import { useAuth } from '@/hooks';
import { useAppTheme } from '@/theme';

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
          letterSpacing: theme.layout.tabBarLetterSpacing,
        }}
      >
        Sair
      </Text>
    </Pressable>
  );
}
