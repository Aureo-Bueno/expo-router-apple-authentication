import { ActivityIndicator, Text, View } from 'react-native';
import { useAppTheme } from '@/theme';
import { Card } from './Card';
import { uiStyles } from './styles';

type StateBlockProps = {
  kind: 'loading' | 'error' | 'empty';
  message?: string;
};

export function StateBlock({ kind, message }: StateBlockProps) {
  const theme = useAppTheme();

  if (kind === 'loading') {
    return (
      <View style={[uiStyles.row, { justifyContent: 'center', paddingVertical: 24 }]}>
        <ActivityIndicator color={theme.colors.primary} />
        <Text style={{ color: theme.colors.textMuted, fontSize: theme.typography.body }}>
          {message ?? 'Carregando...'}
        </Text>
      </View>
    );
  }

  const isError = kind === 'error';
  const text =
    message ?? (isError ? 'Não foi possível carregar os dados.' : 'Nenhum item encontrado.');

  return (
    <Card
      style={{ backgroundColor: isError ? theme.colors.errorBackground : theme.colors.surface }}
    >
      <Text
        accessibilityLiveRegion="polite"
        style={{
          color: isError ? theme.colors.error : theme.colors.textMuted,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body,
          fontWeight: '600',
        }}
      >
        {text}
      </Text>
    </Card>
  );
}
