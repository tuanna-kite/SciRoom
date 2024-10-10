import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface Props {
  children: React.ReactNode
  bg?: string
  safeBottom?: boolean
}

const ScreenWrapper = ({ children, bg, safeBottom = false }: Props) => {
  const { top, bottom } = useSafeAreaInsets()

  const paddingTop = top > 0 ? top + 12 : 30
  const paddingBottom = safeBottom ? bottom + 5 : 0

  return <View style={{ flex: 1, paddingTop, paddingBottom, backgroundColor: bg }}>{children}</View>
}

export default ScreenWrapper
