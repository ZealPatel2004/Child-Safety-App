import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#A78BFA',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          backgroundColor: '#1A1A2E',
          borderTopColor: '#16213E',
          borderTopWidth: 1,
          height: 85,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={focused ? 32 : 28} 
              name="house.fill" 
              color={focused ? '#A78BFA' : '#64748B'} 
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Add Child',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={focused ? 32 : 28} 
              name="person.badge.plus" 
              color={focused ? '#A78BFA' : '#64748B'} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
