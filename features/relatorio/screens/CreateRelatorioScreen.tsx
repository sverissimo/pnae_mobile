import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useCustomNavigation } from "hooks/useCustomNavigation";
import { useManageRelatorio } from "../hooks/useManageRelatorios";
import { FormTemplate } from "../../../components/templates/FormTemplate";
import { Toast } from "components/molecules/Toast";
import { ListTitle } from "../../../components/atoms/ListTitle";
import { relatorioForm } from "../relatorioForm";

export const CreateRelatorioScreen = ({ route }: any) => {
  const { relatorio, handleChange, saveRelatorio } = useManageRelatorio();
  const { navigation } = useCustomNavigation();

  const [visible, setVisible] = useState(false);
  const [disableButton, setDisableButton] = useState(false);

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

  const showSignatureScreen = () => {
    navigation.navigate("GetSignatureScreen", {
      assinaturaURI: relatorio.assinaturaURI,
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
