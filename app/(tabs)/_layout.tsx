import { router, Tabs, usePathname } from 'expo-router';
import { useEffect } from 'react';
import type { ColorValue } from 'react-native';
import { LogoutTabButton } from '@/components/TabBar/LogoutTabButton';
import TabBarIcon from '@/components/TabBarIcon';
import { Screen, StateBlock } from '@/components/ui';
import { useAuth, useClientOnlyValue } from '@/hooks';
import { useAppTheme } from '@/theme';
import { getTabIcon, getTabLabel, type TabRoute } from '@/utils/tab-bar';

export default function TabLayout() {
  const { isReady, signedIn } = useAuth();
  const pathname = usePathname();
  const theme = useAppTheme();
  const headerShown = useClientOnlyValue(false, true);

  useEffect(() => {
    if (isReady && !signedIn && !pathname.endsWith('/sign')) {
      router.replace('/(tabs)/sign');
    }
  }, [isReady, pathname, signedIn]);

  if (!isReady) {
    return (
      <Screen centered>
        <StateBlock kind="loading" message="Carregando sessão..." />
      </Screen>
    );
  }

  const lockedHref = signedIn ? undefined : null;
  const activeColor = theme.colors.primary;
  const inactiveColor = theme.colors.textMuted;

  const tabOptions = (route: TabRoute) => ({
    href: route === 'sign' ? undefined : lockedHref,
    label: getTabLabel(route, signedIn),
    tabBarIcon: ({ color }: { color: ColorValue }) => (
      <TabBarIcon name={getTabIcon(route, signedIn)} color={color} />
    ),
  });

  return (
    <Tabs
      screenOptions={{
        headerShown,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarLabelStyle: {
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.label,
          letterSpacing: theme.layout.tabBarLetterSpacing,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: theme.layout.tabBarHeight,
          paddingBottom: theme.layout.tabBarPaddingBottom,
        },
      }}
    >
      <Tabs.Screen name="index" options={tabOptions('index')} />
      <Tabs.Screen name="about" options={tabOptions('about')} />
      <Tabs.Screen
        name="sign"
        options={{
          ...tabOptions('sign'),
          tabBarButton: signedIn ? LogoutTabButton : undefined,
        }}
      />
      <Tabs.Screen name="locations" options={tabOptions('locations')} />
      <Tabs.Screen name="dogs" options={tabOptions('dogs')} />
    </Tabs>
  );
}
