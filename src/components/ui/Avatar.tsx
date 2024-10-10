import React from 'react'
import { Image } from 'expo-image'
import { getUserImage } from '@/services/users'
import { wp } from '@/helpers/common'

interface AvatarProps {
  uri?: string | null
  size?: 'sm' | 'sm+' | 'md' | 'lg' | 'md+'
  rounded?: 'full' | 'md'
}

const Avatar = ({ uri, size = 'sm', rounded = 'full' }: AvatarProps) => {
  let imageSize = 48
  if (size === 'sm') {
    imageSize = 32
  } else if (size === 'sm+') {
    imageSize = 40
  } else if (size === 'lg') {
    imageSize = wp(25)
  } else if (size === 'md+') {
    imageSize = 54
  }

  let borderRadius = 10
  if (rounded === 'full') {
    borderRadius = imageSize / 2
  }

  return (
    <Image
      source={getUserImage(uri)}
      style={{
        width: imageSize,
        height: imageSize,
        borderRadius,
        borderWidth: 1,
        borderColor: '#4b5563',
      }}
      transition={100}
    />
  )
}

export default Avatar
