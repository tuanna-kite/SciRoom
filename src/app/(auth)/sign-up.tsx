import { Alert, Text, View } from 'react-native'
import { useState } from 'react'
import BackButton from '@/components/ui/BackButton'
import Input from '@/components/ui/Input'
import ScreenWrapper from '@/components/ScreenWrapper'
import { StatusBar } from 'expo-status-bar'
import { Icon } from '@/components/ui/Icon'
import Button from '@/components/ui/Button'
import { router } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'
import { supabase } from '@/lib/supabase'

const styles = {
  title: 'text-4xl text-gray-800 font-psemibold',
}

const SignUp = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async () => {
    try {
      setLoading(true)
      const formData = {
        email: email.toLowerCase().trim(),
        password: password.trim(),
        name: name.trim(),
      }
      if (
        formData.email.length === 0 ||
        formData.password.length === 0 ||
        formData.name.length === 0
      ) {
        return Alert.alert('Error', 'Please fill all the fields!')
      }

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,

        options: {
          data: {
            name: formData.name,
          },
        },
      })
      console.log('supabase.auth.signUp', data, error)

      if (error) {
        throw error
      }
      Alert.alert('Sign Up', 'Account created successfully. Please login to continue.')
      router.replace(ERouteTable.SIGIN_IN)
    } catch (error) {
      console.error(error)
      Alert.alert('Error', 'Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <View className="ml-4">
        <BackButton />
      </View>
      <View className="flex-1 px-8">
        <View className="py-12" style={{ gap: 16 }}>
          <Text className={styles.title}>Let&apos;s</Text>
          <Text className={styles.title}>Get Started</Text>
        </View>

        <View style={{ gap: 28 }}>
          <Text className="text-base color-gray-600">Please login to continue</Text>
          <Input
            placeholder="Enter you name"
            icon={<Icon name="person-outline" size={18} />}
            onChangeText={setName}
          />
          <Input
            placeholder="Enter you email"
            icon={<Icon name="mail-outline" size={18} />}
            onChangeText={setEmail}
          />
          <Input
            placeholder="Enter you password"
            icon={<Icon name="lock-closed-outline" size={18} />}
            secureTextEntry
            onChangeText={setPassword}
          />
          <Button title="Sign Up" onPress={onSubmit} loading={loading} />
        </View>

        <View className="flex-row items-center justify-center mt-6" style={{ gap: 8 }}>
          <Text className="text-base text-gray-700">Already have an account!</Text>
          <Button
            title="Login"
            variant="secondary"
            onPress={() => router.push(ERouteTable.SIGIN_IN)}
          />
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default SignUp
