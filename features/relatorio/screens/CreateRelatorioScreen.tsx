import { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useCustomNavigation } from "hooks/useCustomNavigation";
import { useManageRelatorio } from "../hooks/useManageRelatorios";
import { useManagePictures } from "@shared/hooks";
import { FormTemplate } from "@shared/components/templates";
import { Toast } from "@shared/components/molecules";
import { ListTitle } from "@shared/components/atoms";
import { relatorioForm } from "../relatorioForm";

export const CreateRelatorioScreen = () => {
  const { relatorio, handleChange, saveRelatorio } = useManageRelatorio();
  const { navigation } = useCustomNavigation();
  const { pictureURI, assinaturaURI, clearURIs } = useManagePictures();
  const [visible, setVisible] = useState(false);
  const [disableButton, setDisableButton] = useState(false);

  useEffect(() => {
    clearURIs();
  }, []);

  const handleSaveRelatorio = async () => {
    await saveRelatorio({ ...relatorio, pictureURI, assinaturaURI });
    setVisible(true);
    setDisableButton(true);
    setTimeout(() => {
      navigation.goBack();
    }, 1000);
  };

  const handleDismissSnackbar = () => {
    setVisible(false);
  };

  const showSignatureScreen = () => {
    navigation.navigate("GetSignatureScreen");
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
