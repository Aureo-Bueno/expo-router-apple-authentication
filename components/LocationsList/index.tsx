import { useQuery } from '@apollo/client/react';
import { FlatList, View } from 'react-native';
import { ActionButton, StateBlock, uiStyles } from '@/components/ui';
import { useAppTheme } from '@/theme';
import { GET_LOCATIONS } from './graphql';
import { RenderLocations } from './RenderLocations';

export function LocationsList() {
  const theme = useAppTheme();
  const { loading, error, data, refetch } = useQuery(GET_LOCATIONS);

  if (loading) {
    return <StateBlock kind="loading" message="Carregando localizações..." />;
  }

  if (error) {
    return <StateBlock kind="error" message="Não foi possível carregar as localizações." />;
  }

  if (!data?.locations?.length) {
    return <StateBlock kind="empty" message="Nenhuma localização encontrada." />;
  }

  return (
    <View style={uiStyles.list}>
      <ActionButton label="Recarregar" onPress={() => void refetch()} variant="secondary" />

      <FlatList
        data={data.locations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RenderLocations {...item} />}
        ItemSeparatorComponent={() => (
          <View style={[uiStyles.divider, { backgroundColor: theme.colors.border }]} />
        )}
      />
    </View>
  );
}
