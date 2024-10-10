import { Dimensions } from 'react-native'

export const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window')

export const hp = (percentage: number) => {
  return (percentage * DEVICE_HEIGHT) / 100
}

export const wp = (percentage: number) => {
  return (percentage * DEVICE_WIDTH) / 100
}

export const stripHtmlTags = (html: string) => {
  return html.replace(/<[^>]*>?/gm, '')
}
