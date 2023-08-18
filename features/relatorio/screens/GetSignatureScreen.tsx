import { useContext, useRef } from "react";
import { StyleSheet, View } from "react-native";
import SignatureCanvas from "react-native-signature-canvas";
import { globalColors } from "../../../constants/themes";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RouteParamsList } from "navigation/types";
import { useCustomNavigation } from "hooks/useCustomNavigation";
import { RelatorioContext } from "../../../contexts/RelatorioContext";

const style = `.m-signature-pad--footer
.button {
  background-color: #000000;
  color: #FFF;
}`;

type GetSignatureRouteProp = RouteProp<RouteParamsList, "params">;

export const GetSignatureScreen = ({
  signatureCaptureHandler,
  setShowSignature,
}: any) => {
  const { handleGetSignature } = useContext(RelatorioContext);
  const ref = useRef(null);
  /*
  const { params } = useRoute<GetSignatureRouteProp>();

  const { signatureCaptureHandler } = params;

  const { navigation } = useCustomNavigation();

  const handleSaveSignature = async (signature: string) => {
    const fileURI = await handleGetSignature!(signature);
    signatureCaptureHandler!("assintauraURI", fileURI!);
    navigation.goBack();
  }; */

  const handleSignature = async (signature: string) => {
    const fileURI = await handleGetSignature!(signature);
    signatureCaptureHandler("assinaturaURI", fileURI);
    setShowSignature(false);
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
