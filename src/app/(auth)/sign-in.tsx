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
import { useAppDispatch } from '@/redux'
import { getUserData } from '@/services/users'
import { setUser } from '@/redux/userSlice'
import { Session } from '@supabase/supabase-js'

const styles = {
  title: 'text-4xl text-gray-800 font-psemibold',
  formContainer: '',
}

const SignIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useAppDispatch()

  async function updateProfileState(session: Session) {
    try {
      const res = await getUserData(session.user.id)
      if (res.success) {
        dispatch(setUser({ session, profile: res.data }))
        if (res.data?.email.toLowerCase() === 'admin@gmail.com') {
          router.replace(ERouteTable.ADMIN_DASHBOARD)
        } else {
          router.replace(ERouteTable.HOME)
        }
        return { session, profile: res.data }
      } else {
        Alert.alert('getUserData', res.message)
      }
    } catch (error: any) {
      console.error(error)
      Alert.alert('Error', error)
    }
  }

  const onSubmit = async () => {
    try {
      setLoading(true)
      const formData = {
        email: email.toLowerCase().trim(),
        password: password.trim(),
      }
      if (formData.email.length === 0 || formData.password.length === 0) {
        return Alert.alert('Error', 'Please fill all the fields!')
      }

      const { error, data } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        throw error
      }
      await updateProfileState(data!.session)
    } catch (error) {
      console.error(error)
      Alert.alert('Login', 'There was an error logging in', [{ text: 'OK' }])
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
          <Text className={styles.title}>Hey,</Text>
          <Text className={styles.title}>Welcome Back</Text>
        </View>

        <View style={{ gap: 28 }}>
          <Text className="text-base color-gray-600">Please login to continue</Text>
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
          <Button title="Login" onPress={onSubmit} loading={loading} />

          {/* <Button
            title="Forgot Password?"
            variant="secondary"
            buttonStyle="self-center"
            disabled={loading}
            textStyle="text-black font-pregular"
          /> */}
          {/* <CheckBox label="You are Admin" value={isAdmin} onChange={setIsAdmin} /> */}
        </View>
        <View className="flex-row items-center justify-center mt-6" style={{ gap: 8 }}>
          <Text className="text-base text-gray-700">Don&apos;t have an account?</Text>
          <Button
            title="Sign Up"
            variant="secondary"
            disabled={loading}
            onPress={() => router.push(ERouteTable.SIGIN_UP)}
          />
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default SignIn
