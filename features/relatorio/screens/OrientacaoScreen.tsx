import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { useVoiceRecognition } from "@shared/hooks/useVoiceRecognition";
import { useCustomNavigation } from "@navigation/hooks";
import { TextEditor } from "@shared/components/templates/TextEditor";
import { Icon } from "@shared/components/atoms";
import { globalColors } from "@constants/themes";

export function OrientacaoScreen({ route }: any) {
  const { parentRoute, orientacao } = route.params;
  const { navigation } = useCustomNavigation();
  const { isRecording, speechText, startRecording, stopRecording } =
    useVoiceRecognition();
  const [HTMLText, setHTMLText] = useState<string>(orientacao || "");
  const [disableButton, setDisableButton] = useState<boolean>(true);

  useEffect(() => {
    const isEmptyInput = HTMLText === "<div></div>" || HTMLText.length === 0;
    setDisableButton(isEmptyInput);
  }, [HTMLText]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View style={{ marginRight: 30 }}>
          <Icon iconName="arrow-back" size={26} onPress={handleBackPress} />
        </View>
      ),
    });
  }, [navigation, HTMLText]);

  const handleBackPress = () => {
    navigation.navigate(parentRoute, { HTMLText });
  };

  const handleInput = (descriptionText: string) => {
    setHTMLText(descriptionText);
  };

  const handleRecordAudio = () => {
    if (isRecording) {
      stopRecording();
      return;
    }
    startRecording();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          <TextEditor
            HTMLText={HTMLText}
            setHTMLText={setHTMLText}
            previousOrientacao={orientacao}
            speechText={speechText}
            placeHolder="Digite aqui a orientação"
            handleInput={handleInput}
            isRecording={isRecording}
            handleRecordAudio={handleRecordAudio}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: globalColors.background[100],
    padding: 16,
    alignItems: "center",
  },
  saveButtonStyle: {
    alignSelf: "flex-end",
  },
});
