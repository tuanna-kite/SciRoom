import React from 'react'
import { Tabs } from 'expo-router'
import { Element4, Notification, Profile2User } from 'iconsax-react-native'

const AdminLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#364cd6',
        tabBarInactiveTintColor: '#b4b7c8',
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarIcon: ({ color }) => <Element4 color={color} />,
        }}
      />

      <Tabs.Screen
        name="users"
        options={{
          tabBarIcon: ({ color }) => <Profile2User color={color} />,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          tabBarIcon: ({ color }) => <Notification color={color} />,
        }}
      />
    </Tabs>
  )
}

export default AdminLayout
