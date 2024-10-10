import { useState } from 'react'
import { TextInput, TextInputProps, View } from 'react-native'

interface InputProps extends TextInputProps {
  icon?: React.ReactNode
  containerStyle?: string
  inputStyle?: string
  inputRef?: React.RefObject<TextInput>
}

const defaultStyles = {
  containerStyle:
    'flex-row h-12 px-4 items-center justify-center border border-black/40 rounded-xl space-x-2',
  inputStyle: 'flex-1 h-full text-[16px]',
  placeholderTextColor: '#6b7280', // gray-700
}

const Input = ({
  icon,
  containerStyle = '',
  inputStyle = '',
  inputRef,
  ...textInputProps
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false)
  return (
    <View
      className={`${defaultStyles.containerStyle} ${isFocused && 'border-primary-600'} ${containerStyle}`}
    >
      {icon}
      <TextInput
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`${defaultStyles.inputStyle} ${inputStyle}`}
        placeholderTextColor={defaultStyles.placeholderTextColor}
        ref={inputRef}
        {...textInputProps}
      />
    </View>
  )
}

export default Input
