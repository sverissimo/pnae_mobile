import { useRef } from "react";
import { StyleSheet, View } from "react-native";
import SignatureCanvas from "react-native-signature-canvas";
import { globalColors } from "../../../constants/themes";

export const SignaturePad = () => {
  const ref = useRef(null);

  const handleSignature = (signature: any) => {
    console.log(signature);
  };

  const handleEmpty = () => {
    console.log("Empty");
  };

  const style = `.m-signature-pad--footer
  .button {
    background-color: #000000;
    color: #FFF;
  }`;

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
