import { Text, View } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import ScreenWrapper from '@/components/ScreenWrapper'
import { StatusBar } from 'expo-status-bar'
import { Image } from 'expo-image'
import Button from '@/components/ui/Button'
import { ERouteTable } from '@/constants/route-table'

const WelcomeScreen = () => {
  return (
    <ScreenWrapper bg="white" safeBottom>
      <StatusBar style="dark" />
      <View className="flex-1 px-8 bg-white">
        <View className="flex-1 justify-center items-center">
          <Image
            source={require('@/assets/images/onboarding.png')}
            contentFit="contain"
            className="self-center h-80 w-80"
          />
        </View>

        <View className="w-full gap-y-4 mt-10 mb-6 items-center">
          <Text className="font-pbold text-4xl">SciRoom</Text>
          <Text className="text-gray-700 text-base text-center px-8">
            Where every thougt finds a home and every image tell a story
          </Text>
        </View>

        <View className="items-center mt-10 mb-5" style={{ gap: 12 }}>
          <Button
            buttonStyle="w-full shadow-xl"
            textStyle="text-xl"
            title="Get Started"
            onPress={() => router.push(ERouteTable.SIGIN_UP)}
          />
          <View className="flex-row items-center" style={{ gap: 8 }}>
            <Text className="text-base text-gray-700">Already have an account!</Text>
            <Button
              title="Login"
              variant="secondary"
              onPress={() => router.push(ERouteTable.SIGIN_IN)}
            />
          </View>
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default WelcomeScreen
