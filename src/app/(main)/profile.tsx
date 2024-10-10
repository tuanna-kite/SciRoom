import { ActivityIndicator, Alert, FlatList, Pressable, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAppSelector } from '@/redux'
import ScreenWrapper from '@/components/ScreenWrapper'
import { router } from 'expo-router'
import BackButton from '@/components/ui/BackButton'
import LogoutButton from '@/components/ui/LogoutButton'
import Avatar from '@/components/ui/Avatar'
import { Icon } from '@/components/ui/Icon'
import { ERouteTable } from '@/constants/route-table'
import Header from '@/components/ui/Header'
import { fetchPostsByUser, Post } from '@/services/posts'
import PostCard from '@/components/ui/PostCard'
import colors from 'theme/color'
import { supabase } from '@/lib/supabase'

const Profile = () => {
  const profile = useAppSelector((state) => state.user.data.profile)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)

  const onLogout = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signOut()
    if (error) {
      setLoading(false)
      return Alert.alert('Sign out', "There's an error signing out", [{ text: 'OK' }])
    }
    router.replace('/')
  }

  const getPosts = async () => {
    if (!profile) return null
    const limit = posts.length + 5
    const { success, data } = await fetchPostsByUser(profile.id, limit)

    if (!success || !data) {
      setLoading(false)
      return Alert.alert('Error', 'Failed to fetch posts')
    }

    if (data?.length === posts.length) {
      setHasMore(false)
    }

    setPosts(data)
    setLoading(false)
  }

  useEffect(() => {
    getPosts()
  }, [])

  if (!profile) return null

  return (
    <ScreenWrapper bg="white" safeBottom>
      <View className="px-4">
        <Header
          title="Profile"
          iconLeft={<BackButton />}
          iconRight={<LogoutButton onLogout={onLogout} />}
        />
        <View className="my-4" style={{ gap: 10 }}>
          <View className="self-center">
            <Avatar size="lg" uri={profile?.image} />
            <Pressable
              className="bg-white p-[6px] rounded-full shadow-sm shadow-black/30 absolute bottom-0 right-0 z-10"
              onPress={() => router.push(ERouteTable.PROFILE_EDIT)}
            >
              <Icon name="pencil-outline" size={20} color="#4b5563" />
            </Pressable>
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
              <Text className="text-base font-plight">
                {profile?.bio ? profile?.bio : 'Empty bio'}
              </Text>
            </View>
          </View>
        </View>
        {loading && <ActivityIndicator size="large" color={colors.primary[600]} />}
      </View>
      {posts.length > 0 && <View style={{ height: 1, backgroundColor: 'gray', opacity: 0.3 }} />}
      <View className="flex-1">
        {!loading && (
          <View className="w-full flex-1">
            <FlatList
              renderItem={({ item }) => <PostCard currentUser={profile} post={item} />}
              data={posts}
              // keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingTop: 12 }}
              ItemSeparatorComponent={() => <View className="h-2 bg-slate-200" />}
              onEndReachedThreshold={0}
              onEndReached={() => {
                if (hasMore) getPosts()
              }}
              ListFooterComponent={
                hasMore ? (
                  <ActivityIndicator size="large" color={colors.primary[600]} />
                ) : (
                  <Text className="text-center text-base font-psemibold text-slate-500">
                    No more posts
                  </Text>
                )
              }
            />
          </View>
        )}
      </View>
    </ScreenWrapper>
  )
}

export default Profile
