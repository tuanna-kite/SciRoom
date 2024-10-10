import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { fetchFavoritePosts, Post } from '@/services/posts'
import { useAppSelector } from '@/redux'
import colors from 'theme/color'
import PostCard from '@/components/ui/PostCard'

const Favorites = () => {
  const profile = useAppSelector((state) => state.user.data.profile!)
  const [posts, setPosts] = useState<Post[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)

  const getFavorites = async () => {
    // setLoading(true)
    const limit = posts.length + 5
    const { success, data, message } = await fetchFavoritePosts(profile.id, limit)
    console.log(JSON.stringify(data, null, 2))

    if (!success || !data) {
      setLoading(false)
      return Alert.alert('Error', message)
    }

    if (data?.length === posts.length) {
      setHasMore(false)
    }

    setPosts(data.map((post) => post.post))
    setLoading(false)
  }

  useEffect(() => {
    // Fetch posts
    getFavorites()
  }, [])

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary[700]} />
      </View>
    )
  }

  return (
    <View className="w-full flex-1 bg-white">
      <FlatList
        renderItem={({ item }) => (
          <PostCard currentUser={profile!} post={item} onRemoveLike={getFavorites} />
        )}
        data={posts}
        // keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 12 }}
        ItemSeparatorComponent={() => <View className="h-2 bg-slate-200" />}
        onEndReachedThreshold={0}
        onEndReached={() => {
          if (hasMore) getFavorites()
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
  )
}

export default Favorites

const styles = StyleSheet.create({})
