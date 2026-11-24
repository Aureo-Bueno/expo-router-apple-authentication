import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { ActionButton, Card, Screen, ScreenHeader, uiStyles } from '@/components/ui';
import { useAppTheme } from '@/theme';
import { aboutDescription, aboutTopics } from '@/utils/about-copy';

export default function TabAboutScreen() {
  const theme = useAppTheme();

  return (
    <Screen centered>
      <Card>
        <ScreenHeader
          eyebrow="SOBRE O PROJETO"
          title="Autenticação Apple + GraphQL"
          description={aboutDescription}
        />

        <View style={[uiStyles.list, { marginTop: theme.spacing.xl }]}>
          {aboutTopics.map((topic) => (
            <Card key={topic.title} style={{ padding: theme.spacing.lg, shadowOpacity: 0 }}>
              <Text
                style={{
                  color: theme.colors.text,
                  fontFamily: theme.typography.fontFamily,
                  fontSize: theme.typography.body,
                  fontWeight: '600',
                }}
              >
                {topic.title}
              </Text>
              <Text
                style={{
                  color: theme.colors.textMuted,
                  fontSize: theme.typography.body,
                  lineHeight: theme.typography.bodyLineHeight,
                  marginTop: theme.spacing.xs,
                }}
              >
                {topic.description}
              </Text>
            </Card>
          ))}
        </View>

        <View style={{ marginTop: theme.spacing.xl }}>
          <ActionButton
            label="Abrir modal"
            onPress={() => router.push('/modal')}
            variant="secondary"
          />
        </View>
      </Card>
    </Screen>
  );
}
