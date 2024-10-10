import { useEffect } from 'react'
import { ActivityIndicator, Alert, View } from 'react-native'
import { router } from 'expo-router'
import { useAppDispatch } from '@/redux'
import { supabase } from '@/lib/supabase'
import { removeUser, setUser } from '@/redux/userSlice'
import { ERouteTable } from '@/constants/route-table'
import { Session } from '@supabase/supabase-js'
import { getUserData } from '@/services/users'
import colors from 'theme/color'

const Index = () => {
  const dispatch = useAppDispatch()

  async function updateProfileState(session: Session) {
    try {
      const res = await getUserData(session.user.id)
      if (res.success) {
        dispatch(setUser({ session, profile: res.data }))
        return { session, profile: res.data }
      } else {
        throw new Error(res.message)
      }
    } catch (error: any) {
      console.error(error)
      Alert.alert('Error', 'Something went wrong!')
    }
  }

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const res = await updateProfileState(session)
        if (res) {
          if (res.profile?.email.toLowerCase() === 'admin@gmail.com') {
            router.replace(ERouteTable.ADMIN_DASHBOARD)
          } else {
            router.replace(ERouteTable.HOME)
          }
        }
      } else {
        dispatch(removeUser())
        router.replace(ERouteTable.WELCOME)
      }
    })
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const res = await updateProfileState(session)
        if (res) {
          if (res.profile?.email.toLowerCase() === 'admin@gmail.com') {
            router.replace(ERouteTable.ADMIN_DASHBOARD)
          } else {
            router.replace(ERouteTable.HOME)
          }
        }
      } else {
        dispatch(removeUser())
      }
    })
  }, [])

  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color={colors.primary[600]} />
    </View>
  )
}

export default Index
