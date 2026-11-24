import * as AppleAuthentication from 'expo-apple-authentication';
import { useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { ActionButton, Card, Screen, ScreenHeader, uiStyles } from '@/components/ui';
import { useAuth } from '@/hooks';
import { getAppleSignInErrorMessage, getDisplayName } from '@/services/apple-auth';
import { useAppTheme } from '@/theme';

export default function TabSignScreen() {
  const { displayName, signIn, signOut, signedIn } = useAuth();
  const theme = useAppTheme();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (loading) {
      return;
    }

    setErrorMessage(null);
    setLoading(true);

    try {
      const credentials = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      await signIn(getDisplayName(credentials.fullName));
    } catch (error) {
      const message = getAppleSignInErrorMessage(error);

      if (message) {
        setErrorMessage(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setErrorMessage(null);
    await signOut();
  };

  const welcomeMessage = signedIn ? `Bem-vindo, ${displayName ?? 'usuário'}!` : null;
  const visibleMessage = welcomeMessage ?? errorMessage;

  return (
    <Screen centered>
      <Card>
        <ScreenHeader
          eyebrow="APPLE ID"
          title="Entre com segurança"
          description="Use sua Apple ID para entrar. A sessão fica salva apenas neste dispositivo."
        />

        {!signedIn && (
          <>
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={theme.radius.md}
              style={{
                width: '100%',
                height: 48,
                marginTop: theme.spacing.xl,
                opacity: loading ? 0.6 : 1,
              }}
              onPress={handleSignIn}
            />
            {loading && (
              <View style={{ alignItems: 'center', marginTop: theme.spacing.md }}>
                <ActivityIndicator color={theme.colors.primary} />
              </View>
            )}
          </>
        )}

        {visibleMessage && (
          <View
            style={[
              uiStyles.status,
              {
                backgroundColor: welcomeMessage
                  ? theme.colors.successBackground
                  : theme.colors.errorBackground,
                marginTop: theme.spacing.xl,
              },
            ]}
          >
            <Text
              accessibilityLiveRegion="polite"
              style={{
                color: welcomeMessage ? theme.colors.success : theme.colors.error,
                fontFamily: theme.typography.fontFamily,
                fontSize: theme.typography.body,
                fontWeight: '600',
              }}
            >
              {visibleMessage}
            </Text>
          </View>
        )}

        {signedIn && (
          <View style={{ marginTop: theme.spacing.xl }}>
            <ActionButton label="Sair" onPress={handleSignOut} variant="secondary" />
          </View>
        )}
      </Card>
    </Screen>
  );
}
