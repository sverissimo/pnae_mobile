import { globalColors } from "@constants/themes";
import { FC, useRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";
import { Icon } from "../atoms";

const toolbarColor = globalColors.primary[100];

type TextEditorProps = {
  children?: React.ReactNode;
  HTMLText: string;
  placeHolder: string;
  handleInput: (HTMLText: string) => void;
  handleRecordAudio: (HTMLText: string) => void;
};

export const TextEditor: FC<TextEditorProps> = ({
  HTMLText,
  placeHolder,
  handleInput,
  handleRecordAudio,
}) => {
  const richText = useRef<RichEditor>(null);
  const scrollRef = useRef<ScrollView>(null);

  const onCursorPosition = (scrollY: number) => {
    scrollRef.current?.scrollTo({ y: scrollY - 30, animated: true });
  };

  return (
    <View style={styles.textEditorContainer}>
      <RichToolbar
        editor={richText}
        selectedIconTint={globalColors.primary[600]}
        iconTint={globalColors.grayscale[800]}
        actions={[
          actions.keyboard,
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
          actions.insertBulletsList,
          actions.insertOrderedList,
          actions.indent,
          actions.outdent,
          "recordAudio",
        ]}
        iconMap={{
          recordAudio: () => (
            <Icon
              iconName="microphone"
              size={20}
              color={globalColors.grayscale[800]}
            />
          ),
        }}
        recordAudio={handleRecordAudio}
        style={styles.textToolbarStyle}
      />
      <ScrollView ref={scrollRef} style={styles.textContainer}>
        <RichEditor
          ref={richText}
          placeholder={placeHolder}
          onChange={handleInput}
          onCursorPosition={onCursorPosition}
          style={styles.textEditorStyle}
          initialHeight={500}
          useContainer={true}
          initialContentHTML={HTMLText}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  textEditorContainer: {
    height: 400,
    width: "100%",
    marginBottom: 10,
    borderRadius: 30,
  },

  textToolbarStyle: {
    width: "100%",
    backgroundColor: toolbarColor,
    borderColor: toolbarColor,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
  },

  textContainer: {
    flex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },

  textEditorStyle: {
    borderRadius: 30,
    height: 150,
    fontSize: 20,
    marginBottom: 10,
  },
});
