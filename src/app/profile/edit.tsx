import { Alert, Pressable, View } from 'react-native'
import ScreenWrapper from '@/components/ScreenWrapper'
import { useAppDispatch, useAppSelector } from '@/redux'
import Avatar from '@/components/ui/Avatar'
import { Icon } from '@/components/ui/Icon'
import { router } from 'expo-router'
import BackButton from '@/components/ui/BackButton'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useEffect, useState } from 'react'
import { updateUserData, UserProfileUpdate } from '@/services/users'
import { setUser } from '@/redux/userSlice'
import * as ImagePicker from 'expo-image-picker'
import { uploadFile } from '@/services/images'
import Header from '@/components/ui/Header'

const ProfileEdit = () => {
  const currentProfile = useAppSelector((state) => state.user.data.profile)
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState<string | null | undefined>(currentProfile?.image)
  const dispatch = useAppDispatch()

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    address: '',
    image: currentProfile?.image,
  })

  useEffect(() => {
    setProfile({
      name: currentProfile?.name || '',
      email: currentProfile?.email || '',
      phone: currentProfile?.phone || '',
      address: currentProfile?.address || '',
      bio: currentProfile?.bio || '',
      image: currentProfile?.image,
    })
  }, [currentProfile])

  const onSubmit = async () => {
    setLoading(true)
    const userData: UserProfileUpdate = {
      name: profile.name.trim(),
      email: profile.email.toLowerCase().trim(),
      phone: profile.phone.trim(),
      address: profile.address.trim(),
      bio: profile.bio.trim(),
    }

    // Upload image
    if (image && image.length) {
      const { success, message, data } = await uploadFile('images', image)
      if (!success) {
        console.log('Failed to upload image:', message)
        return Alert.alert('Profile', 'Failed to upload your image. Please try again later')
      }
      userData.image = data
    }

    if (Object.values(userData).some((value) => value.length === 0)) {
      return Alert.alert('Profile', 'Please fill all the fields before updating your profile')
    }

    // Update user data
    const { success, message, data } = await updateUserData(currentProfile!.id, userData)
    if (!success) {
      console.log('Failed to update profile:', message)
      return Alert.alert('Profile', 'Failed to update your profile. Please try again later')
    }
    dispatch(setUser({ profile: data }))
    setLoading(false)
    router.back()
  }

  const onPickImage = async () => {
    // Pick image from gallery
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    })
    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }

  return (
    <ScreenWrapper bg="white">
      <View className="px-4">
        <Header title="Update profile" iconLeft={<BackButton />} />
        <View className="self-center my-10">
          <Avatar size="lg" uri={image} />
          <Pressable
            className="bg-white p-[6px] rounded-full shadow-sm shadow-black/30 absolute bottom-0 right-0 z-10"
            style={{ elevation: 20 }}
            onPress={() => onPickImage()}
          >
            <Icon name="camera-outline" size={20} color="#4b5563" />
          </Pressable>
        </View>

        <View style={{ gap: 28 }}>
          <Input
            placeholder="Enter you name"
            value={profile.name}
            icon={<Icon name="person-outline" size={18} />}
            onChangeText={(text) => setProfile({ ...profile, name: text })}
          />
          <Input
            placeholder="Enter you email"
            value={profile.email}
            icon={<Icon name="mail-outline" size={18} />}
            onChangeText={(text) => setProfile({ ...profile, email: text })}
          />
          <Input
            placeholder="Enter you phone"
            value={profile.phone}
            icon={<Icon name="call-outline" size={18} />}
            onChangeText={(text) => setProfile({ ...profile, phone: text })}
          />
          <Input
            placeholder="Enter you address"
            value={profile.address}
            icon={<Icon name="location-outline" size={18} />}
            onChangeText={(text) => setProfile({ ...profile, address: text })}
          />
          <Input
            placeholder="Enter you bio"
            value={profile.bio}
            onChangeText={(text) => setProfile({ ...profile, bio: text })}
            containerStyle="h-[120px]"
            multiline
          />
          <Button title="Update" loading={loading} onPress={onSubmit} />
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default ProfileEdit
