import { Text, View } from 'react-native'
import React from 'react'

interface HeaderProps {
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  title: string
}

const Header = ({ iconLeft, iconRight, title }: HeaderProps) => {
  return (
    <View className="flex-row items-center justify-between w-full">
      <View className="w-10">{iconLeft}</View>
      <Text className="font-pbold text-2xl text-gray-700 border-gray-400">{title}</Text>
      <View className="w-10">{iconRight}</View>
    </View>
  )
}

export default Header
