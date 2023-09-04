import { globalColors } from "@constants/themes";
import { useCustomNavigation } from "@navigation/hooks";
import { CustomButton } from "@shared/components/atoms";
import { TextEditor } from "@shared/components/templates/TextEditor";
import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";

export function OrientacaoScreen({ route }: any) {
  const { parentRoute, orientacao } = route.params;
  const { navigation } = useCustomNavigation();
  const [HTMLText, setHTMLText] = useState<string>(orientacao || "");
  const [disableButton, setDisableButton] = useState<boolean>(true);

  useEffect(() => {
    // const emptyTags = /<[^>]*>(\s*|&nbsp;)<\/[^>]*>/;
    const emptyTags = /<div><\/div>/;
    const isEmptyInput = emptyTags.test(HTMLText) || HTMLText.length === 0;
    setDisableButton(isEmptyInput);
  }, [HTMLText]);

  const handleInput = (descriptionText: string) => {
    if (typeof descriptionText === "string") {
      setHTMLText(descriptionText);
    }
  };

  const handleSave = (HTMLText: string) => {
    navigation.navigate(parentRoute, { HTMLText });
  };

  const handleRecordAudio = () => {};

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          <TextEditor
            HTMLText={orientacao}
            placeHolder="Digite aqui a orientação"
            handleInput={handleInput}
            handleRecordAudio={handleRecordAudio}
          />
          <CustomButton
            icon="content-save"
            mode="contained"
            label="Salvar"
            style={styles.saveButtonStyle}
            buttonColor={globalColors.primary[600]}
            disabled={disableButton}
            onPress={() => handleSave(HTMLText)}
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
