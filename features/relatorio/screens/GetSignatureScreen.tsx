import { useRef } from "react";
import { LogBox, StyleSheet, View } from "react-native";
import SignatureCanvas from "react-native-signature-canvas";
import { globalColors } from "../../../constants/themes";
import { getSignatureFileURI } from "@shared/utils/signatureUtils";
import { useCustomNavigation } from "hooks/useCustomNavigation";
import { deleteFile } from "@shared/utils/fileSystemUtils";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state.",
]);

const style = `.m-signature-pad--footer
.button {
  background-color: #000;
  color: #FFF;
}`;

export const GetSignatureScreen = ({ route }: any) => {
  const ref = useRef(null);
  const { assinaturaURI, handleChange } = route.params;

  const { navigation } = useCustomNavigation();

  const handleSignature = async (signature: string) => {
    const fileURI = await getSignatureFileURI(signature);

    if (fileURI) {
      if (assinaturaURI) {
        await deleteFile(assinaturaURI);
      }
      handleChange("assinaturaURI", fileURI);
      navigation.goBack();
    }
  };

  const handleEmpty = () => {
    console.log("Empty");
  };

  return (
    <View style={styles.container}>
      <SignatureCanvas
        ref={ref}
        onOK={handleSignature}
        onEmpty={handleEmpty}
        descriptionText="Assine aqui!"
        clearText="Limpar"
        confirmText="Confirmar"
        webStyle={style}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalColors.grayscale[50],
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
