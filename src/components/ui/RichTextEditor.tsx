import { StyleSheet, Text, View } from 'react-native'
import React, { LegacyRef, useRef } from 'react'
import { actions, RichToolbar, RichEditor } from 'react-native-pell-rich-editor'

interface RichTextEditorProps {
  editorRef: LegacyRef<RichEditor> | undefined
  onChange: (html: string) => void
  value?: string
}
interface IconMapProps {
  tintColor: string
}

const RichTextEditor = ({ onChange, editorRef, value = '' }: RichTextEditorProps) => {
  return (
    <View className="min-h-[300px]">
      <RichToolbar
        iconSize={22}
        style={styles.richBar}
        flatContainerStyle={styles.flatStyle}
        editor={editorRef}
        disabled={false}
        iconMap={{
          [actions.heading1]: ({ tintColor }: IconMapProps) => (
            <Text className="text-2xl font-semibold" style={{ color: tintColor }}>
              H1
            </Text>
          ),
          [actions.heading3]: ({ tintColor }: IconMapProps) => (
            <Text className="text-xl font-semibold" style={{ color: tintColor }}>
              H2
            </Text>
          ),
          [actions.setParagraph]: ({ tintColor }: IconMapProps) => (
            <Text className="text-lg font-semibold" style={{ color: tintColor }}>
              P
            </Text>
          ),
        }}
        selectedIconTint="black"
        actions={[
          actions.keyboard,
          actions.heading1,
          actions.heading3,
          actions.setParagraph,
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
          actions.setStrikethrough,
          actions.insertBulletsList,
          actions.insertOrderedList,
          actions.alignLeft,
          actions.alignCenter,
          actions.alignRight,
          actions.blockquote,
          actions.code,
          actions.insertLine,
          actions.insertLink,
        ]}
      />
      <RichEditor
        ref={editorRef}
        initialContentHTML={value}
        containerStyle={styles.editorContainer}
        editorStyle={styles.contentStyle}
        placeholder="Write something amazing..."
        onChange={onChange}
      />
    </View>
  )
}

export default RichTextEditor

const styles = StyleSheet.create({
  richBar: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: 'gray',
    marginTop: 20,
  },
  flatStyle: {
    paddingHorizontal: 8,
    gap: 4,
  },
  editorContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 8,
    borderColor: 'gray',
    minHeight: 240,
  },
  contentStyle: {},
})
