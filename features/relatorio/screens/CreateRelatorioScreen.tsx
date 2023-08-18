import { ScrollView, StyleSheet } from "react-native";
import { ListTitle } from "../../../components/atoms/ListTitle";
import { FormTemplate } from "../../../components/templates/FormTemplate";
import { Button } from "react-native-paper";
import { relatorioForm } from "../relatorioForm";
import { useManageRelatorio } from "../hooks/useManageRelatorios";
import { useCustomNavigation } from "hooks/useCustomNavigation";
import { useSelectProdutor } from "features/produtor/hooks/useSelectProdutor";
import { Toast } from "components/molecules/Toast";
import { useState } from "react";
import { GetSignatureScreen } from "./GetSignatureScreen";

export const CreateRelatorioScreen = () => {
  const [visible, setVisible] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const { navigation } = useCustomNavigation();
  const { produtor } = useSelectProdutor();
  const { relatorio, handleChange, saveRelatorio, handleGetSignature } =
    useManageRelatorio(produtor?.id_pessoa_demeter);
  console.log(
    "🚀 ~ file: CreateRelatorioScreen.tsx:20 ~ CreateRelatorioScreen ~ relatorio:",
    relatorio
  );

  const handleSaveRelatorio = async () => {
    await saveRelatorio();
    setVisible(true);
    setDisableButton(true);
    setTimeout(() => {
      navigation.goBack();
    }, 1000);
  };

  const handleDismissSnackbar = () => {
    setVisible(false);
  };

  if (showSignature) {
    return (
      <GetSignatureScreen
        signatureCaptureHandler={handleChange}
        setShowSignature={setShowSignature}
      />
    );
  }

  return (
    <>
      <ScrollView style={styles.container}>
        <ListTitle title="Preencha as informações abaixo" />
        <FormTemplate
          form={relatorioForm}
          data={relatorio}
          onValueChange={handleChange}
          signatureCaptureHandler={handleGetSignature}
          setShowSignature={setShowSignature}
        />
        <Button
          mode="contained"
          style={styles.button}
          onPress={handleSaveRelatorio}
          disabled={disableButton}
        >
          Salvar
        </Button>
      </ScrollView>
      <Toast
        message="Relatório salvo com sucesso!"
        visible={visible}
        onDismiss={handleDismissSnackbar}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    marginVertical: "6%",
  },
});
