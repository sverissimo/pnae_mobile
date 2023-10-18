import { useRef } from "react";
import SignatureScreen from "react-native-signature-canvas";
import { useCustomNavigation } from "@navigation/hooks";
import { useManagePictures } from "@shared/hooks";

const style = `
.m-signature-pad {
  position: absolute;
  width: 90%;
  height: 90%;
  top: 5%;
  left: 5%;
  background-color: #fff;
}

.m-signature-pad--body {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 30px;
  border: 1px solid #f4f4f4;
}

.m-signature-pad--body canvas {
  width: 100%;
  height: 100%;
}

.m-signature-pad--footer {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.m-signature-pad--footer .button {
  background-color: #000;
  margin-bottom: 20px;
  color: #FFF;
  padding: 10px 20px 40px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
}
`;

export const GetSignatureScreen = () => {
  const ref = useRef(null);
  const { handleGetSignature } = useManagePictures();

  const { navigation } = useCustomNavigation();

  const handleSignature = async (signatureURI: string) => {
    await handleGetSignature(signatureURI);
    navigation.goBack();
  };

  const handleEmpty = () => {
    console.log("Empty");
  };

  return (
    <SignatureScreen
      ref={ref}
      onOK={handleSignature}
      onEmpty={handleEmpty}
      autoClear={true}
      descriptionText="Assine no espaço demarcado."
      clearText="Limpar"
      confirmText="Confirmar"
      rotated={true}
      webStyle={style}
    />
  );
};
