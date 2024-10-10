import { ActivityIndicator, Alert, FlatList, Pressable, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAppSelector } from '@/redux'
import ScreenWrapper from '@/components/ScreenWrapper'
import { Icon } from '@/components/ui/Icon'
import { router } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'
import Avatar from '@/components/ui/Avatar'
import { fetchPosts, Post } from '@/services/posts'
import PostCard from '@/components/ui/PostCard'
import { supabase } from '@/lib/supabase'
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { getUserData } from '@/services/users'
import { Image } from 'expo-image'
import colors from 'theme/color'

const Home = () => {
  const profile = useAppSelector((state) => state.user.data.profile)
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<Post[]>([])
  const [hasMore, setHasMore] = useState(true)

  const getPosts = async () => {
    const limit = posts.length + 5
    const { success, data } = await fetchPosts(limit)

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

  const handlePostEvent = async (payload: RealtimePostgresChangesPayload<Post>) => {
    if (payload.eventType === 'INSERT' && payload.new.id) {
      console.log('INSERT - INSERT')

      const { data, success } = await getUserData(payload.new.userId)
      const newPost = { ...payload.new }
      if (success && data) {
        newPost.user = data
        setPosts((prevPosts) => [newPost, ...prevPosts])
      }
    } else if (payload.eventType === 'DELETE' && payload.old.id) {
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== payload.old.id))
    } else if (payload.eventType === 'UPDATE' && payload.new.id) {
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === payload.new.id) {
            return { ...post, ...payload.new }
          }
          return post
        }),
      )
    }
  }

  useEffect(() => {
    const postChannel = supabase
      .channel('posts')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts',
        },
        handlePostEvent,
      )
      .subscribe()

    getPosts()

    return () => {
      supabase.removeChannel(postChannel)
    }
  }, [])

  return (
    <ScreenWrapper bg="white" safeBottom>
      <View className="flex-1">
        <View className="flex-row justify-between items-center  px-4 pb-4">
          <Image
            source={require('../../../assets/images/h-logo.png')}
            style={{ height: 40, aspectRatio: 3.5 }}
            contentFit="cover"
          />
          <View className="flex-row" style={{ gap: 16 }}>
            <Pressable onPress={() => router.push(ERouteTable.FAVORITES)}>
              <Icon name="heart-outline" size={28} color="#4b5563" />
            </Pressable>
            <Pressable onPress={() => router.push(ERouteTable.POSTS_CREATE)}>
              <Icon name="create-outline" size={28} color="#4b5563" />
            </Pressable>
            <Pressable onPress={() => router.push(ERouteTable.PROFILE)}>
              <Avatar uri={profile?.image} />
            </Pressable>
          </View>
        </View>

        <View style={{ height: 1, backgroundColor: 'gray', opacity: 0.3 }} />

        <View className="flex-1">
          {loading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color={colors.primary[600]} />
            </View>
          ) : (
            <View className="w-full flex-1">
              <FlatList
                renderItem={({ item }) => <PostCard currentUser={profile!} post={item} />}
                data={posts}
                // keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 12 }}
                ItemSeparatorComponent={() => <View className="h-2 bg-slate-200" />}
                onEndReachedThreshold={0}
                onEndReached={() => {
                  if (hasMore) getPosts()
                }}
                ListHeaderComponent={<View />}
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
      </View>
    </ScreenWrapper>
  )
}

export default Home
