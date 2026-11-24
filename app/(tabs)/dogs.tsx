import { DogsList } from '@/components/DogsList';
import { Card, Screen, ScreenHeader } from '@/components/ui';

export default function TabDogsScreen() {
  return (
    <Screen scroll={false}>
      <Card>
        <ScreenHeader
          eyebrow="GRAPHQL"
          title="Raças de cães"
          description="Dados de cães carregados pela API GraphQL com estados de carregamento, erro e recarga."
        />
        <DogsList />
      </Card>
    </Screen>
  );
}
