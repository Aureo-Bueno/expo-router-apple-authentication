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
