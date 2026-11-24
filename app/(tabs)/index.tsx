import { router } from 'expo-router';
import { View } from 'react-native';
import { ActionButton, Card, Screen, ScreenHeader, uiStyles } from '@/components/ui';
import { useAuth } from '@/hooks';
import { useAppTheme } from '@/theme';

export default function TabHomeScreen() {
  const { displayName } = useAuth();
  const theme = useAppTheme();

  return (
    <Screen centered>
      <Card>
        <ScreenHeader
          eyebrow="APPLE ID"
          title={`Olá, ${displayName ?? 'usuário'}!`}
          description="Sua sessão Apple está ativa neste dispositivo. Escolha uma seção para continuar."
        />

        <View style={[uiStyles.list, { marginTop: theme.spacing.xl }]}>
          <ActionButton label="Ver cães" onPress={() => router.push('/(tabs)/dogs')} />
          <ActionButton
            label="Ver locais"
            onPress={() => router.push('/(tabs)/locations')}
            variant="secondary"
          />
          <ActionButton
            label="Sobre o projeto"
            onPress={() => router.push('/(tabs)/about')}
            variant="secondary"
          />
        </View>
      </Card>
    </Screen>
  );
}
