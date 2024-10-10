import { Text, View, ViewProps } from 'react-native'
import React from 'react'
import { Icon as IconType } from 'iconsax-react-native'

export type SummaryCardProps = {
  title: string
  value: number | string
  icon: IconType
} & ViewProps

const SummaryCard = ({ title, value, icon: Icon, ...viewProps }: SummaryCardProps) => {
  return (
    <View
      className="bg-white p-4 space-y-4 flex-1 rounded-lg shadow-sm shadow-black/5"
      {...viewProps}
    >
      <View className="flex-row items-center space-x-2">
        <View className="border-[0.5px] p-1.5 rounded-full border-blue-300">
          <Icon size={20} className="text-blue-600" />
        </View>
        <Text className="text-gray-500 font-pmedium">{title}</Text>
      </View>
      <View>
        <Text className="text-2xl font-pmedium">{value}</Text>
      </View>
    </View>
  )
}

export default SummaryCard
