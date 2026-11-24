import { useQuery } from '@apollo/client/react';
import { FlatList, Text, View } from 'react-native';
import { ActionButton, Card, StateBlock, uiStyles } from '@/components/ui';
import { useAppTheme } from '@/theme';
import { GET_DOGS_QUERY } from './graphql';

export function DogsList() {
  const theme = useAppTheme();
  const { loading, error, data, refetch } = useQuery(GET_DOGS_QUERY);

  if (loading) {
    return <StateBlock kind="loading" message="Carregando cães..." />;
  }

  if (error) {
    return <StateBlock kind="error" message="Não foi possível carregar os cães." />;
  }

  if (!data?.dogs?.length) {
    return <StateBlock kind="empty" message="Nenhum cão encontrado." />;
  }

  return (
    <View style={uiStyles.list}>
      <ActionButton label="Recarregar" onPress={() => void refetch()} variant="secondary" />

      <FlatList
        data={data.dogs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={{ marginBottom: theme.spacing.md }}>
            <Text
              style={{
                color: theme.colors.text,
                fontFamily: theme.typography.fontFamily,
                fontSize: theme.typography.body,
                fontWeight: '600',
              }}
            >
              {item.name}
            </Text>
            <Text
              style={{
                color: theme.colors.textMuted,
                fontSize: theme.typography.body,
                lineHeight: theme.typography.bodyLineHeight,
                marginTop: theme.spacing.xs,
              }}
            >
              {item.breed}
            </Text>
            <Text
              style={{
                color: theme.colors.textMuted,
                fontFamily: theme.typography.fontFamily,
                fontSize: theme.typography.label,
                marginTop: theme.spacing.sm,
              }}
            >
              {item.id}
            </Text>
          </Card>
        )}
      />
    </View>
  );
}
