import SummaryCard from '@/components/admin-ui/SummaryCard'
import UserItem from '@/components/admin-ui/UserItem'
import ScreenWrapper from '@/components/ScreenWrapper'
import Avatar from '@/components/ui/Avatar'
import LogoutButton from '@/components/ui/LogoutButton'
import { supabase } from '@/lib/supabase'
import { fetchNumberOfPosts } from '@/services/posts'
import { fetchNewUsers, fetchNumberOfUsers, UserProfile } from '@/services/users'
import { router } from 'expo-router'
import { DocumentText, Profile2User, Verify } from 'iconsax-react-native'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from 'react-native'
import colors from 'theme/color'

// TODO: Show total number of posts, number of reports, and number of users, number of professors
// TODO: Show 5 users with the most posts
// TODO: Show 5 posts with the most likes

const AdminDashboard = () => {
  const [nPosts, setNPosts] = useState(0)
  const [nUsers, setNUsers] = useState(0)
  const [newUsers, setNewUsers] = useState<UserProfile[]>([])
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setRefreshing] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!isRefreshing) {
        return
      }
      try {
        const numberOfPostsRes = await fetchNumberOfPosts()
        const numberOfUsersRes = await fetchNumberOfUsers()
        const newUsersRes = await fetchNewUsers()
        if (!numberOfPostsRes.success || !numberOfUsersRes.success || !newUsersRes.success) {
          setError('Failed to fetch data')
        }
        setNPosts(numberOfPostsRes.data!.count)
        setNUsers(numberOfUsersRes.data!.count)
        setNewUsers(newUsersRes.data!)
      } catch (error) {
        console.log(error)
      } finally {
        setRefreshing(false)
        setLoading(false)
      }
    }

    fetchData()
  }, [isRefreshing])

  const onLogout = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signOut()
    if (error) {
      setLoading(false)
      return Alert.alert('Sign out', "There's an error signing out", [{ text: 'OK' }])
    }
    router.replace('/')
  }

  if (isLoading) {
    return (
      <ScreenWrapper bg="#f1f6fa">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary[600]} />
        </View>
      </ScreenWrapper>
    )
  }

  if (error) {
    return (
      <ScreenWrapper bg="#f1f6fa">
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg font-semibold text-red-500">{error || 'ERROR'}</Text>
          <TouchableOpacity onPress={() => setRefreshing(true)}>
            <Text className="text-lg font-semibold text-blue-500">Try again</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    )
  }

  return (
    <ScreenWrapper bg="#f1f6fa">
      <View className="flex-row justify-between px-6 py-6">
        <Text className="text-2xl font-semibold">Dashboard</Text>
        <LogoutButton onLogout={onLogout} />
      </View>
      <View className="px-6 space-y-4">
        <View className="space-x-4 flex-row">
          <SummaryCard title="Total Users" value={nUsers} icon={Profile2User} />
          <SummaryCard title="Total Posts" value={nPosts} icon={DocumentText} />
        </View>
        <View>
          <View className="flex-row mb-4 mt-6 justify-between items-center">
            <Text className="text-lg font-semibold">New Users</Text>
            <TouchableOpacity
              activeOpacity={0.75}
              className="px-4 py-1 rounded-full border-[0.5px] border-blue-600"
              onPress={() => router.push('(admin)/users')}
            >
              <Text className="text-blue-600">View all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={newUsers}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View className="h-4" />}
            renderItem={({ item }) => <UserItem profile={item} />}
          />
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default AdminDashboard
