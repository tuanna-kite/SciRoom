import { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { Icon } from './Icon'
import colors from 'theme/color'

export interface CheckBoxProps {
  label: string
  value?: boolean
  onChange?: (value: boolean) => void
}

const CheckBox = ({ label, value = false, onChange }: CheckBoxProps) => {
  const [checked, setChecked] = useState(value)

  const handlePress = () => {
    setChecked(!checked)
    onChange && onChange(!checked)
  }
  return (
    <TouchableOpacity onPress={handlePress}>
      <View className="flex-row space-x-2 items-center">
        <Icon
          name={checked ? 'checkbox' : 'checkbox-outline'}
          color={checked ? colors.primary[600] : 'gray'}
          size={20}
        />
        <Text>{label}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default CheckBox
