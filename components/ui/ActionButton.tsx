import { Pressable, type StyleProp, Text, type ViewStyle } from 'react-native';
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
