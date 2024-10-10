import * as FileSystem from 'expo-file-system'
import { decode } from 'base64-arraybuffer'
import { supabase } from '@/lib/supabase'
import { env } from '@/env-config'

export const getFilePath = (folderName: string, isImage: boolean) => {
  return `/${folderName}/${new Date().getTime()}${isImage ? '.png' : '.mp4'}`
}

export const uploadFile = async (folderName: string, fileUri: string, isImage = true) => {
  try {
    const fileName = getFilePath(folderName, isImage)
    const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    })
    const imageData = decode(fileBase64) // array buffer
    const { data, error } = await supabase.storage
      .from('social_media')
      .upload(fileName, imageData, {
        contentType: isImage ? 'image/*' : 'video/*',
      })

    if (error) {
      console.error(error)
      return { success: false, message: error.message }
    }

    return { success: true, data: data.path }
  } catch (error: any) {
    console.error(error)
    return { success: false, message: 'Could not upload media' }
  }
}

export const getSupabaseUrl = (file: string | null) => {
  if (!file) return
  return `${env.SUPABASE_URL}/storage/v1/object/public/social_media/${file}`
}

export const downloadFile = async (file: string, isImage = true) => {}
