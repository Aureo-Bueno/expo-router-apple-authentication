import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { ActionButton, Card, Screen, ScreenHeader } from '@/components/ui';
import { useAppTheme } from '@/theme';

export default function ModalScreen() {
  const theme = useAppTheme();

  return (
    <Screen centered>
      <Card>
        <ScreenHeader
          eyebrow="EXPO ROUTER"
          title="Modal"
          description="Esta é uma rota modal do app, agora com o mesmo estilo das demais telas."
        />
        <ActionButton
          label="Voltar"
          onPress={() => router.back()}
          variant="secondary"
          style={{ marginTop: theme.spacing.xl }}
        />
      </Card>
      <StatusBar
        style={Platform.OS === 'ios' ? (theme.mode === 'dark' ? 'light' : 'dark') : 'auto'}
      />
    </Screen>
  );
}
