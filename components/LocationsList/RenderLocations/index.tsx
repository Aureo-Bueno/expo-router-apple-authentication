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
