import { Alert, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { Icon } from './Icon'
import { supabase } from '@/lib/supabase'

interface LogoutButtonProps {
  onLogout: () => void
}

const LogoutButton = ({ onLogout }: LogoutButtonProps) => {
  const handleLogout = () => {
    Alert.alert('Confirm', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: () => onLogout(),
        style: 'destructive',
      },
    ])
  }

  return (
    <Pressable onPress={handleLogout}>
      <Icon name="log-out-outline" size={28} color="#b91c1c" />
    </Pressable>
  )
}

export default LogoutButton

const styles = StyleSheet.create({})
