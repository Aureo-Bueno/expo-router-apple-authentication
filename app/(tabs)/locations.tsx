import { LocationsList } from '@/components/LocationsList';
import { Card, Screen, ScreenHeader } from '@/components/ui';

export default function TabLocationsScreen() {
  return (
    <Screen scroll={false}>
      <Card>
        <ScreenHeader
          eyebrow="GRAPHQL"
          title="Localizações"
          description="Locais carregados pela API GraphQL, com descrição e imagem em cards themeados."
        />
        <LocationsList />
      </Card>
    </Screen>
  );
}
