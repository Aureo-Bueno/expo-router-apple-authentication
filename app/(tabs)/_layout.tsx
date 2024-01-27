import React, { useContext } from 'react';
import { Tabs } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import TabBarIcon from '@/components/TabBarIcon';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: useClientOnlyValue(false, true),
      }}>
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
            }}
          />
          <Tabs.Screen
            name="about"
            options={{
              title: 'About',
              tabBarIcon: ({ color }) => <TabBarIcon name="archive" color={color} />,
            }}
          />
      <Tabs.Screen
        name="sign"
        options={{
          title: 'Sign',
          tabBarIcon: ({ color }) => <TabBarIcon name="sign-in" color={color} />,
        }}
      />
    </Tabs>
  );
}
