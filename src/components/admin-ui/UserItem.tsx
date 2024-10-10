import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Avatar from '../ui/Avatar'
import { UserProfile } from '@/services/users'
import { Verify } from 'iconsax-react-native'
import { router } from 'expo-router'

const UserItem = ({ profile }: { profile: UserProfile }) => {
  return (
    <TouchableOpacity
      onPress={() => router.push({ pathname: '/profile/show', params: profile as any })}
    >
      <View className="flex-row bg-white p-4 rounded-lg shadow-sm">
        <Avatar uri={profile.image} size="md" />
        <View className="ml-4 justify-center space-y-1 flex-1">
          <Text className="font-semibold text-lg">{profile.name}</Text>
          <Text className="text-gray-500">{profile.email}</Text>
        </View>

        <View className="justify-center">
          {profile.professor && <Verify size={24} variant="Bold" className="text-blue-600" />}
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default UserItem
