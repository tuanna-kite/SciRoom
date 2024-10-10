import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useEffect, useRef, useState } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Header from '@/components/ui/Header'
import BackButton from '@/components/ui/BackButton'
import Avatar from '@/components/ui/Avatar'
import RichTextEditor from '@/components/ui/RichTextEditor'
import { useAppSelector } from '@/redux'
import { RichEditor } from 'react-native-pell-rich-editor'
import { Icon } from '@/components/ui/Icon'
import * as ImagePicker from 'expo-image-picker'
import { Image } from 'expo-image'
import { getSupabaseUrl } from '@/services/images'
import { Video } from 'expo-av'
import { createOrUpdatePost, PostData } from '@/services/posts'
import { router, useLocalSearchParams } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'
import colors from 'theme/color'
import axios from 'axios'

type ImagePickerAsset = ImagePicker.ImagePickerAsset

const CreatePost = () => {
  const editPost = useLocalSearchParams<{ body: string; file: string; postId: string }>()
  const isEditing = !!editPost.postId

  const { profile } = useAppSelector((state) => state.user.data)
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<ImagePickerAsset | string | null>(null)
  const editorRef = useRef<RichEditor>(null)

  useEffect(() => {
    if (isEditing) {
      setBody(editPost.body || '')
      setFile(editPost.file || null)
    }
  }, [])

  const getFilePlace = (file: ImagePickerAsset | null | string) => {
    if (!file) return null
    if (typeof file === 'string') return 'remote'

    return 'local'
  }

  const getFileType = (file: ImagePickerAsset | null | string) => {
    if (!file) return null
    if (getFilePlace(file) === 'local') {
      return (file as ImagePickerAsset).type
    }
    if (getFilePlace(file) === 'remote') {
      return (file as string).includes('.mp4') ? 'video' : 'image'
    }
  }

  const getFileUri = (file: ImagePickerAsset | null | string) => {
    if (!file) return undefined
    if (getFilePlace(file) === 'local') {
      return (file as ImagePickerAsset).uri
    }

    return getSupabaseUrl(file as string)
  }

  const onPick = async (isImage: boolean) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: isImage
        ? ImagePicker.MediaTypeOptions.Images
        : ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: isImage ? [1, 1] : undefined,
      quality: 1,
    })
    if (!result.canceled) {
      setFile(result.assets[0])
    }
  }

  const onSubmit = async () => {
    if (body.trim().length === 0 && !file) {
      return Alert.alert('Post', 'Please add some content or an image/video')
    }

    const formData = new FormData()
    formData.append('text', body.trim())
    formData.append('lang', 'en')
    formData.append('models', 'general,self-harm')
    formData.append('mode', 'ml')
    formData.append('api_user', '1417654151')
    formData.append('api_secret', 'RT3ViYhXun5J9j5BMncGHdK7WSmpwDyP')

    setLoading(true)

    try {
      const { data } = await axios.post('https://api.sightengine.com/1.0/text/check.json', formData)

      const fields = ['sexual', 'discriminatory', 'insulting', 'violent', 'toxic', 'self-harm']
      console.log(JSON.stringify(data, null, 2))

      const isSafe = fields.every((field) => data.moderation_classes[field] < 0.05)

      if (!isSafe) {
        setLoading(false)
        return Alert.alert(
          'Post Failed',
          'Your post contains harmful content. Please remove it and try again',
        )
      }
    } catch (error) {
      setLoading(false)
      console.log('Create Post Error:', error)
      return Alert.alert('Post', 'Failed to create post. Please try again later')
    }

    const data: PostData = { body, file, userId: profile!.id }
    if (isEditing) {
      data.id = editPost.postId
    }

    const res = await createOrUpdatePost(data)
    if (!res.success) {
      return Alert.alert('Post', 'Failed to create post. Please try again later')
    }

    setLoading(false)
    router.replace(ERouteTable.HOME)
  }

  return (
    <ScreenWrapper bg="white" safeBottom>
      <View className="flex-1">
        <View className="px-4 pb-4">
          <Header
            title={isEditing ? 'Update Post' : 'Create Post'}
            iconLeft={<BackButton />}
            iconRight={
              <TouchableOpacity onPress={() => onSubmit()}>
                {loading ? (
                  <ActivityIndicator size="small" color={colors.primary[700]} />
                ) : (
                  <Icon name="cloud-upload-outline" size={28} color={colors.primary[700]} />
                )}
              </TouchableOpacity>
            }
          />
        </View>

        <View className="flex-1">
          <ScrollView>
            <View className="flex-row space-x-4 items-center mt-6 px-4">
              <Avatar size="md+" uri={profile?.image} />
              <View className="flex-1">
                <Text className="text-xl font-psemibold">{profile?.name}</Text>
                <View className="flex-row items-center space-x-2">
                  <Icon name="globe-outline" size={16} color="#6b7280" />
                  <Text className="text-gray-500 text-base">Public</Text>
                </View>
              </View>
              <View className="flex-row space-x-6 text-blu">
                <TouchableOpacity onPress={() => onPick(true)}>
                  <Icon name="image-outline" size={28} color={colors.primary[700]} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onPick(false)}>
                  <Icon name="videocam-outline" size={28} color={colors.primary[700]} />
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <RichTextEditor editorRef={editorRef} onChange={setBody} value={body} />
            </View>
            {file && (
              <View className="px-4 py-2">
                {getFileType(file) === 'video' ? (
                  <Video
                    className="w-full aspect-video rounded-2xl border-2 border-black/30"
                    source={{ uri: getFileUri(file)! }}
                    useNativeControls
                    isLooping
                  />
                ) : (
                  <Image
                    source={{ uri: getFileUri(file) }}
                    className="w-full aspect-square rounded-2xl border-2 border-black/30"
                  />
                )}
                <TouchableOpacity
                  className="absolute right-8 top-6 bg-red-700/70 p-1 rounded-full"
                  activeOpacity={0.7}
                  onPress={() => setFile(null)}
                >
                  <Icon name="trash-outline" size={20} color="white" />
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default CreatePost
