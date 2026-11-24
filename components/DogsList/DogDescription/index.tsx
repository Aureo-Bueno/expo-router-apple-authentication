import { useQuery } from '@apollo/client/react';
import { Text } from 'react-native';
import { Card, StateBlock } from '@/components/ui';
import { useAppTheme } from '@/theme';
import { GET_DOG_QUERY } from './graphql';

export interface DogDescriptionProps {
  dogId: string;
}

export function DogDescription({ dogId }: DogDescriptionProps) {
  const theme = useAppTheme();
  const { loading, error, data } = useQuery(GET_DOG_QUERY, {
    variables: { id: dogId },
  });

  if (loading) {
    return <StateBlock kind="loading" message="Carregando detalhes..." />;
  }

  if (error) {
    return <StateBlock kind="error" message="Não foi possível carregar os detalhes." />;
  }

  if (!data?.dog) {
    return <StateBlock kind="empty" message="Cão não encontrado." />;
  }

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
        {data.dog.name}
      </Text>
      <Text
        style={{
          color: theme.colors.textMuted,
          fontSize: theme.typography.body,
          lineHeight: theme.typography.bodyLineHeight,
          marginTop: theme.spacing.xs,
        }}
      >
        {data.dog.breed}
      </Text>
      <Text
        style={{
          color: theme.colors.textMuted,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.label,
          marginTop: theme.spacing.sm,
        }}
      >
        {data.dog.id}
      </Text>
    </Card>
  );
}
