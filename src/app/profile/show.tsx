import { View, Text, Alert } from 'react-native'
import React from 'react'
import Avatar from '@/components/ui/Avatar'
import { UserProfile } from '@/services/users'
import { Icon } from '@/components/ui/Icon'
import { useLocalSearchParams } from 'expo-router'
import Button from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'

const ShowProfile = () => {
  const profile = useLocalSearchParams() as UserProfile
  const [active, setActive] = React.useState(profile.active)
  const toggleActive = async () => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ active: !profile.active })
        .eq('id', profile.id)

      if (error) {
        return Alert.alert('Error', 'Failed to update profile')
      }
      if (active) {
        Alert.alert('Success', 'User is inactive')
      } else {
        Alert.alert('Success', 'User is active')
      }
      setActive(!active)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <View className=" bg-white flex-1 px-6 pt-12" style={{ gap: 10 }}>
      <View className="self-center">
        <Avatar size="lg" uri={profile.image} />
      </View>
      <View>
        <Text className="text-xl font-pmedium text-center">{profile?.name}</Text>
        <Text className="text-base font-pextralight text-center">{profile?.address}</Text>
      </View>

      <View className="mt-2 px-4 space-y-3">
        <View className="flex-row items-center space-x-2">
          <Icon name="mail-outline" size={20} color="#4b5563" />
          <Text className="text-base font-plight">{profile?.email}</Text>
        </View>
        <View className="flex-row items-center space-x-2">
          <Icon name="call-outline" size={20} color="#4b5563" />
          <Text className="text-base font-plight">
            {profile?.phone ? profile?.phone : 'Empty phone'}
          </Text>
        </View>
        <View className="flex-row items-center space-x-2">
          <Icon name="information-circle-outline" size={20} color="#4b5563" />
          <Text className="text-base font-plight">{profile?.bio ? profile?.bio : 'Empty bio'}</Text>
        </View>
      </View>
      <View className="mt-8">
        <Button
          title={active ? 'Inactive' : 'Active'}
          onPress={toggleActive}
          buttonStyle={active ? 'bg-red-600' : ''}
        />
      </View>
    </View>
  )
}

export default ShowProfile
