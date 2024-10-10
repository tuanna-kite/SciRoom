import UserItem from '@/components/admin-ui/UserItem'
import Input from '@/components/ui/Input'
import { supabase } from '@/lib/supabase'
import { UserProfile } from '@/services/users'
import { CloseCircle, UserSearch } from 'iconsax-react-native'
import React, { useEffect } from 'react'
import { ActivityIndicator, FlatList, Keyboard, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import colors from 'theme/color'

const Users = () => {
  const [users, setUsers] = React.useState<UserProfile[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState('')
  const [onSearch, setOnSearch] = React.useState(false)
  const [showUsers, setShowUsers] = React.useState<UserProfile[]>([])
  const { top } = useSafeAreaInsets()
  const paddingTop = top > 0 ? top + 5 : 30

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .neq('email', 'admin@gmail.com')
        if (error) {
          throw error
        }
        setUsers(data)
        setShowUsers(data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSearch = () => {
    setOnSearch(true)
    const filteredUsers = users.filter((user) => user.email.includes(search.toLowerCase()))
    setShowUsers(filteredUsers)
  }

  const handleReset = () => {
    setOnSearch(false)
    setShowUsers(users)
    setSearch('')
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={colors.primary[600]} />
      </View>
    )
  }

  return (
    <View className="bg-[#f1f6fa] flex-1">
      <View
        className="justify-between items-center px-6 border-b-[0.2px] border-b-gray-500 pb-6 bg-white"
        style={{ paddingTop }}
      >
        <Text className="text-2xl font-semibold mb-4">Users</Text>
        <View className="flex-row items-center">
          <Input
            placeholder="Search users by email..."
            containerStyle="flex-1 mr-4"
            onChangeText={setSearch}
          />
          {!onSearch ? (
            <TouchableOpacity onPress={handleSearch} disabled={!search.length}>
              <UserSearch
                size={24}
                className={search.length > 0 ? 'text-blue-600' : 'text-gray-500'}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleReset} disabled={!search.length}>
              <CloseCircle size={24} className="text-blue-600" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View className="flex-1 px-4">
        <FlatList
          data={showUsers}
          onScroll={() => Keyboard.dismiss()}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View className="h-4" />}
          ListHeaderComponent={() => <View className="h-8" />}
          ListFooterComponent={() => <View className="h-8" />}
          renderItem={({ item }) => <UserItem profile={item} />}
        />
      </View>
    </View>
  )
}

export default Users
