import { ActivityIndicator, Pressable, Text } from 'react-native'
import React from 'react'
import colors from 'theme/color'

export interface ButtonProps {
  title: string
  variant?: 'primary' | 'secondary'
  textStyle?: string
  buttonStyle?: string
  loading?: boolean
  disabled?: boolean
  onPress?: () => void
}

const Button = ({
  title,
  textStyle,
  buttonStyle,
  onPress,
  loading = false,
  variant = 'primary',
  disabled = false,
}: ButtonProps) => {
  if (loading) {
    return <ActivityIndicator size="large" color={colors.primary[600]} />
  }
  const _textStyle =
    'text-base font-psemibold ' + (variant === 'primary' ? 'text-white' : 'text-primary-600')

  const _buttonStyle =
    variant === 'primary'
      ? 'bg-primary-600 px-8 h-12 justify-center items-center rounded-xl active:bg-primary-700'
      : 'bg-transparent justify-center items-center'

  return (
    <Pressable onPress={onPress} className={`${_buttonStyle} ${buttonStyle}`} disabled={disabled}>
      <Text className={`${_textStyle} ${textStyle}`}>{title}</Text>
    </Pressable>
  )
}

export default Button
