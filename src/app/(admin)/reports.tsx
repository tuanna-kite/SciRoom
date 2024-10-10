import ScreenWrapper from '@/components/ScreenWrapper'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import PostCard from '@/components/ui/PostCard'
import { supabase } from '@/lib/supabase'
import { deletePost, Post } from '@/services/posts'
import { UserProfile } from '@/services/users'
import React, { useEffect } from 'react'
import { ActivityIndicator, Alert, FlatList, Text, View } from 'react-native'
import colors from 'theme/color'

type Report = {
  id: string
  post_id: string
  user_id: string
  user?: UserProfile
  post?: Post
  note?: string
  created_at: string
}

const Reports = () => {
  const [reports, setReports] = React.useState<Report[]>([])
  const [onRefresh, setOnRefresh] = React.useState(true)
  const [loading, setLoading] = React.useState(false)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('reports')
          .select(
            `
          id,
          note,
          created_at,
          status,
          post (
            *,
            user: users (id, name, image)
          ),
          user (*)
        `,
          )
          .neq('status', 'resolved')
        if (error) {
          throw error
        }

        setReports(data as any)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
        setOnRefresh(false)
      }
    }
    if (onRefresh) {
      fetchReports()
    }
    return () => {}
  }, [onRefresh])

  const onDeletePost = async (postId: string, reportId: string) => {
    Alert.alert('Delete post', 'Are you sure you want to delete this post?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            setLoading(true)
            await deletePost(postId)

            const { error } = await supabase
              .from('reports')
              .update({ status: 'resolved' })
              .eq('id', reportId)
            if (error) {
              throw error
            }
            setTimeout(() => {
              setOnRefresh(true)
            }, 500)
          } catch (error) {
            setLoading(false)
            Alert.alert('Delete post error')
          }
        },
      },
    ])
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={colors.primary[600]} />
      </View>
    )
  }

  return (
    <ScreenWrapper bg="#f1f6fa">
      <View>
        <FlatList
          data={reports}
          ListHeaderComponent={() => (
            <Text className="text-2xl font-bold text-center py-4 mb-4">Reports</Text>
          )}
          ListEmptyComponent={() => (
            <Text className="text-center text-lg font-semibold my-4">No reports found</Text>
          )}
          ListFooterComponent={() => <View className="h-8" />}
          renderItem={({ item }) => (
            <View className="mx-4 p-4 bg-white rounded-xl">
              <View className="flex-row mb-4 items-center">
                <Avatar size="md" uri={item.user?.image} />
                <Text className="flex-1 ml-4">
                  <Text className="font-semibold text-base">{item.user?.email}</Text> has reported
                  this post
                </Text>
              </View>
              <Button
                title="Remove Post"
                buttonStyle="bg-red-600"
                onPress={() => onDeletePost(item.post!.id, item.id)}
              />
              <PostCard showMore={false} showEdit={false} post={{ ...item.post! }} />
            </View>
          )}
        />
      </View>
    </ScreenWrapper>
  )
}

export default Reports
