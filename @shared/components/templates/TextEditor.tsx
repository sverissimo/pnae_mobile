import { globalColors } from "@constants/themes";
import { useRef, useState, FC } from "react";
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
import { CustomButton, Icon } from "../atoms";

const toolbarColor = globalColors.primary[100];

type TextEditorProps = {
  children?: React.ReactNode;
  initialHTMLText: string;
  handleSave: (HTMLText: string) => void;
};

export const TextEditor: FC<TextEditorProps> = ({
  initialHTMLText,
  handleSave,
}) => {
  const richText = useRef<RichEditor>(null);
  const scrollRef = useRef<ScrollView>(null);
  const [HTMLText, setHTMLText] = useState<string>(initialHTMLText || "");
  const [disableButton, setDisableButton] = useState<boolean>(true);

  const handleRecordAudio = () => {
    console.log("Recording...");
  };

  const handleInput = (descriptionText: string) => {
    if (descriptionText) {
      setDisableButton(false);
      setHTMLText(descriptionText);
    }
  };

  const onCursorPosition = (scrollY: number) => {
    scrollRef.current?.scrollTo({ y: scrollY - 30, animated: true });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
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
                //   actions.undo,
                //   actions.redo,
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
                onChange={handleInput}
                placeholder="Escreva a orientação aqui..."
                onCursorPosition={onCursorPosition}
                style={styles.textEditorStyle}
                initialHeight={500}
                useContainer={true}
                initialContentHTML={HTMLText}
              />
            </ScrollView>
          </View>

          <CustomButton
            onPress={() => handleSave(HTMLText)}
            icon="content-save"
            mode="contained"
            label="Salvar"
            style={styles.saveButtonStyle}
            buttonColor={globalColors.primary[600]}
            disabled={disableButton}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: globalColors.background[100],
    padding: 20,
    alignItems: "center",
  },

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

  saveButtonStyle: {
    alignSelf: "flex-end",
  },
});
