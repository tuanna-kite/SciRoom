import { Pressable, StyleSheet, Text, View } from 'react-native'
import { router } from 'expo-router'
import { Icon } from './Icon'

const BackButton = () => {
  return (
    <Pressable className="self-start p-1 rounded-lg bg-black/5" onPress={() => router.back()}>
      <Icon name="chevron-back" size={24} />
    </Pressable>
  )
}

export default BackButton
