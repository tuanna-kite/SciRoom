import { Alert, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { createPostLike, Post, removePostLike } from '@/services/posts'
import { UserProfile } from '@/services/users'
import Avatar from './Avatar'
import moment from 'moment'
import { Icon } from './Icon'
import { DEVICE_WIDTH } from '@/helpers/common'
import { Image } from 'expo-image'
import { getSupabaseUrl } from '@/services/images'
import { ResizeMode, Video } from 'expo-av'
import { router } from 'expo-router'
import AutoHeightWebView from 'react-native-autoheight-webview'
import { Forbidden, Verify } from 'iconsax-react-native'
import { supabase } from '@/lib/supabase'
// import { ERouteTable } from '@/constants/route-table'

interface PostCardProps {
  post: Post
  currentUser?: UserProfile
  showMore?: boolean
  showEdit?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onRemoveLike?: () => void
}

const PostCard = ({
  post,
  currentUser,
  showMore = true,
  showEdit = false,
  onDelete,
  onEdit,
  onRemoveLike: onRemoveLikeProp,
}: PostCardProps) => {
  const createdAt = moment(post.created_at).fromNow()
  const nComments = post.nComments ? post.nComments[0].count : post.comments?.length || 0
  const [height, setHeight] = useState(0)
  const likes = post.likes || []
  const [numLikes, setNumLikes] = useState(likes.length)

  const [liked, setLiked] = useState(!!likes.find((like) => like.userId === currentUser?.id))

  const onPostDetail = () => {
    if (!showMore) return
    router.push({ pathname: '/posts/detail', params: { postId: post.id } })
  }

  const onLike = async () => {
    const data = {
      postId: post.id,
      userId: currentUser!.id,
    }
    const { success, message } = await createPostLike(data)

    if (!success) {
      return Alert.alert('Post', message)
    }
    setNumLikes(numLikes + 1)
    setLiked(true)
  }

  const onRemoveLike = async () => {
    const data = {
      postId: post.id,
      userId: currentUser!.id,
    }
    const { success, message } = await removePostLike(data)

    if (!success) {
      return Alert.alert('Post', message)
    }

    if (onRemoveLikeProp) {
      onRemoveLikeProp()
    }
    setNumLikes(numLikes - 1)
    setLiked(false)
  }
  const onReport = async () => {
    Alert.alert('Report', 'Are you sure you want to report this post?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Report',
        style: 'destructive',
        onPress: async () => {
          try {
            const { error } = await supabase.from('reports').insert({
              post: post.id,
              user: currentUser!.id,
            })
            if (error) {
              throw error
            }
          } catch (error) {
            Alert.alert('Report', 'Failed to report the post')
          }
        },
      },
    ])
  }

  return (
    <View className="min-h-[100px] w-full bg-white p-4 space-y-4">
      <View className="flex-row space-x-4">
        <Avatar uri={post.user!.image} size="md+" />
        <View className="flex-1 space-y-1">
          <View className="flex-row space-x-2 items-center">
            <Text className="font-pmedium text-lg">{post.user!.name}</Text>
            <Verify size={20} variant="Bold" color="#3b82f6" />
          </View>
          <Text className="font-pmedium text-sm text-gray-400">{createdAt}</Text>
        </View>
        {showMore && (
          <TouchableOpacity className="p-1" onPress={onPostDetail}>
            <Icon name="ellipsis-horizontal" size={24} color="#4b5563" />
          </TouchableOpacity>
        )}
        {showEdit && post.userId === currentUser?.id && (
          <View className="flex-row space-x-3">
            <TouchableOpacity className="p-1" onPress={onEdit}>
              <Icon name="pencil" size={24} color="#4b5563" />
            </TouchableOpacity>
            <TouchableOpacity className="p-1" onPress={onDelete}>
              <Icon name="trash-outline" size={24} color="#ef4444" />
            </TouchableOpacity>
          </View>
        )}
      </View>
      {/* Post body */}
      <View>
        {post.body && (
          <AutoHeightWebView
            scrollEnabled={false}
            onSizeUpdated={(size) => setHeight(size.height + 12)}
            source={{
              html: `
              <!DOCTYPE html>
              <html lang="en">
              <head>
                <style>
                  * {
                    margin: 0;
                    padding: 0;
                  }
                  body { width: 80% }
                  p {font-size: 16px !important;}
                  h1,h2,h3,h4 {font-size: 18px !important;}
                </style>
              </head>
              <body>
                ${post.body}
              </body>
              </html>
            `,
            }}
            style={{ width: DEVICE_WIDTH - 32, height: height, flex: 1 }}
            viewportContent={'width=device-width, user-scalable=no'}
          />
        )}
      </View>
      {/* Post file */}
      <View>
        {post.file && post.file.includes('images') && (
          <Image
            source={{ uri: getSupabaseUrl(post.file) }}
            className="w-full aspect-square rounded-2xl border border-black/20"
            transition={100}
            contentFit="cover"
          />
        )}
        {post.file && post.file.includes('videos') && (
          <Video
            source={{ uri: getSupabaseUrl(post.file) as string }}
            className="w-full aspect-video rounded-2xl border border-black/20"
            useNativeControls
            resizeMode={ResizeMode.COVER}
          />
        )}
      </View>
      {(showEdit || showMore) && (
        <View className="flex-row space-x-4 pt-2">
          <View className="flex-row space-x-1 items-center">
            <TouchableOpacity className="text-slate-400" onPress={liked ? onRemoveLike : onLike}>
              <Icon
                name={liked ? 'heart' : 'heart-outline'}
                size={28}
                color={liked ? '#ef4444' : '#64748b'}
              />
            </TouchableOpacity>
            <Text className={`text-base ${liked ? 'text-red-500' : 'text-slate-500'}`}>
              {numLikes}
            </Text>
          </View>
          <View className="flex-row space-x-1 items-center">
            <TouchableOpacity className="text-slate-400" onPress={() => onPostDetail()}>
              <Icon name="chatbox-ellipses-outline" size={28} color="#64748b" />
            </TouchableOpacity>
            <Text className="text-base text-slate-500">{nComments}</Text>
          </View>
          {post.userId != currentUser?.id && (
            <View>
              <TouchableOpacity className="text-slate-400" onPress={() => onReport()}>
                <View className="flex-row space-x-1 items-center">
                  <Forbidden size={24} color="#64748b" />
                  <Text className="text-base text-slate-500">Report</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  )
}

export default PostCard
