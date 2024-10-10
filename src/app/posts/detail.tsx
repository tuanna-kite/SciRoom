import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { Comment, createComment, deletePost, fetchPostDetail, Post } from '@/services/posts'
import PostCard from '@/components/ui/PostCard'
import { useAppSelector } from '@/redux'
import Input from '@/components/ui/Input'
import { Icon } from '@/components/ui/Icon'
import CommentItem from '@/components/ui/CommentItem'
import { supabase } from '@/lib/supabase'
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { getUserData } from '@/services/users'
import colors from 'theme/color'
import axios from 'axios'

const PostDetail = () => {
  const { postId = '' } = useLocalSearchParams<{ postId: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const profile = useAppSelector((state) => state.user.data.profile!)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const getPostDetail = async () => {
    const { success, data } = await fetchPostDetail(postId)
    if (!success || !data) {
      Alert.alert('Post detail', 'Failed to fetch post detail')
    } else {
      setPost(data)
    }
  }

  const onNewComment = async () => {
    if (!comment) return
    setLoading(true)
    const formData = new FormData()
    formData.append('text', comment.trim())
    formData.append('lang', 'en')
    formData.append('models', 'general,self-harm')
    formData.append('mode', 'ml')
    formData.append('api_user', '1417654151')
    formData.append('api_secret', 'RT3ViYhXun5J9j5BMncGHdK7WSmpwDyP')

    try {
      const { data } = await axios.post('https://api.sightengine.com/1.0/text/check.json', formData)

      const fields = ['sexual', 'discriminatory', 'insulting', 'violent', 'toxic', 'self-harm']
      console.log(JSON.stringify(data, null, 2))

      const isSafe = fields.every((field) => data.moderation_classes[field] < 0.05)

      if (!isSafe) {
        setLoading(false)
        return Alert.alert(
          'Comment Failed',
          'Your comment contains harmful content. Please remove it and try again',
        )
      }
    } catch (error) {
      setLoading(false)
      console.log('Create Post Error:', error)
      return Alert.alert('Post', 'Failed to create post. Please try again later')
    }

    // Add new comment
    const { success, message } = await createComment({
      postId,
      userId: profile.id,
      text: comment,
    })

    // Reset comment input
    if (!success) {
      Alert.alert('Comment', message)
    } else {
      setLoading(false)
      setComment('')
    }
  }

  const handleNewComment = async (payload: RealtimePostgresChangesPayload<Comment>) => {
    if (payload.eventType === 'INSERT' && payload.new.id) {
      const { data: user, success } = await getUserData(payload.new.userId)
      if (!success) return

      const newComment = { ...payload.new, user }

      setPost((prevPost) => {
        if (!prevPost) return prevPost
        return {
          ...prevPost,
          comments: [newComment, ...prevPost.comments!],
        }
      })
    }
  }

  const onEditPost = () => {
    router.back()
    router.push({
      pathname: 'posts/create',
      params: { postId, body: post?.body, file: post?.file },
    })
  }

  const onDeletePost = async () => {
    Alert.alert('Delete post', 'Are you sure you want to delete this post?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setLoading(true)
          deletePost(postId)
            .then(() => {
              router.back()
            })
            .catch((error) => {
              setLoading(false)
              Alert.alert('Delete post', error.message)
            })
        },
      },
    ])
  }

  // const onDeleteComment = () => {}

  useEffect(() => {
    const commentChannel = supabase
      .channel('comments')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `postId=eq.${postId}`,
        },
        handleNewComment,
      )
      .subscribe((status) => console.log(status))

    getPostDetail()

    return () => {
      supabase.removeChannel(commentChannel)
    }
  }, [])

  return (
    <View className="flex-1 bg-white items-center justify-center">
      {!post ? (
        <ActivityIndicator size="large" color={colors.primary[600]} />
      ) : (
        <ScrollView className="w-full" showsVerticalScrollIndicator={false}>
          <View className="w-full px-2">
            <PostCard
              post={post}
              currentUser={profile}
              showMore={false}
              showEdit={true}
              onEdit={onEditPost}
              onDelete={onDeletePost}
            />
          </View>
          <View className="flex-row space-x-4 items-center px-4">
            <Input
              placeholder="Write a comment..."
              containerStyle="flex-1"
              onSubmitEditing={() => {}}
              value={comment}
              onChangeText={setComment}
            />
            {loading ? (
              <ActivityIndicator color={colors.primary[600]} />
            ) : (
              <TouchableOpacity onPress={onNewComment} disabled={comment.length === 0}>
                <Icon
                  name="send-outline"
                  size={24}
                  color={comment.length ? colors.primary[600] : 'gray'}
                />
              </TouchableOpacity>
            )}
          </View>
          <View className="pb-20">
            {Number(post?.comments?.length) > 0 && (
              <FlatList
                data={post.comments}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <CommentItem data={item} />}
                scrollEnabled={false}
              />
            )}

            {post?.comments?.length === 0 && (
              <Text className="text-center text-gray-400 text-base my-6">No comments yet</Text>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  )
}

export default PostDetail
