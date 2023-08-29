import { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useCustomNavigation } from "hooks/useCustomNavigation";
import { useManageRelatorio } from "../hooks/useManageRelatorios";
import { FormTemplate } from "../../../@shared/components/templates/FormTemplate";
import { Toast } from "@shared/components/molecules/Toast";
import { relatorioForm } from "../relatorioForm";
import { ListTitle } from "@shared/components/atoms";
import { useRoute } from "@react-navigation/native";
import { Relatorio } from "../types/Relatorio";
import { useManagePictures } from "@shared/hooks";

export const CreateRelatorioScreen = ({ route }: any) => {
  const { relatorio, handleChange, saveRelatorio } = useManageRelatorio();
  const { navigation } = useCustomNavigation();
  const { setPicture, setAssinatura } = useManagePictures();
  const [visible, setVisible] = useState(false);
  const [disableButton, setDisableButton] = useState(false);

  console.log(
    "🚀 ~ file: CreateRelatorioScreen.tsx:16 ~ CreateRelatorioScreen ~ relatorio:",
    relatorio
  );
  useEffect(() => {
    setPicture("");
    setAssinatura("");
  }, []);

  // const relatorios = useRoute().params
  const handleSaveRelatorio = async () => {
    //TODO: refactor this
    await saveRelatorio(relatorio);
    /* //@ts-ignore
    relatorios.push(relatorio) */
    setVisible(true);
    // setDisableButton(true);
    // setTimeout(() => {
    //   navigation.goBack();
    // }, 1000);
  };

  const handleDismissSnackbar = () => {
    setVisible(false);
  };

  const showSignatureScreen = () => {
    navigation.navigate("GetSignatureScreen", {
      assinaturaURI: relatorio!.assinaturaURI,
      handleChange,
    });
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <ListTitle title="Preencha as informações abaixo" />
        <FormTemplate
          form={relatorioForm}
          data={relatorio}
          onValueChange={handleChange}
          showSignatureScreen={showSignatureScreen}
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
