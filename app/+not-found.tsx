import { router, Stack } from 'expo-router';
import { ActionButton, Card, Screen, ScreenHeader } from '@/components/ui';
import { useAppTheme } from '@/theme';

export default function NotFoundScreen() {
  const theme = useAppTheme();

  return (
    <>
      <Stack.Screen options={{ title: 'Página não encontrada' }} />
      <Screen centered>
        <Card>
          <ScreenHeader
            eyebrow="ERRO 404"
            title="Página não encontrada"
            description="A rota que você tentou abrir não existe neste app."
          />
          <ActionButton
            label="Voltar para o início"
            onPress={() => router.replace('/(tabs)')}
            style={{ marginTop: theme.spacing.xl }}
          />
        </Card>
      </Screen>
    </>
  );
}
