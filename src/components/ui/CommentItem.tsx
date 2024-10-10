import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Comment } from '@/services/posts'
import Avatar from './Avatar'
import moment from 'moment'

interface CommentItemProps {
  data: Comment
}

const CommentItem = ({ data }: CommentItemProps) => {
  const createdAt = moment(data.created_at).fromNow(true)
  return (
    <View className="flex-row space-x-3 px-4 mt-6">
      <Avatar size="sm+" uri={data.user?.image} />
      <View className="space-y-2 p-3 bg-gray-100/30 rounded-xl">
        <View className="flex-row items-center space-x-2">
          <Text className="font-pmedium text-base">{data.user?.name}</Text>
          <Text className="text-sm">{createdAt}</Text>
        </View>
        <Text>{data.text}</Text>
      </View>
    </View>
  )
}

export default CommentItem

const styles = StyleSheet.create({})
