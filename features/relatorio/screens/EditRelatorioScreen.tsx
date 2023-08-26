import { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useCustomNavigation } from "hooks/useCustomNavigation";
import { useManageRelatorio } from "../hooks/useManageRelatorios";
import { FormTemplate } from "../../../@shared/components/templates/FormTemplate";
import { Toast } from "@shared/components/molecules/Toast";
import { relatorioForm } from "../relatorioForm";
import { ListTitle } from "@shared/components/atoms";
import { Relatorio } from "../types/Relatorio";

export const EditRelatorioScreen = ({ route }: any) => {
  const [relatorio, setRelatorio] = useState<Relatorio>({});
  const { saveRelatorio } = useManageRelatorio();
  const { navigation } = useCustomNavigation();
  const { relatorios } = useManageRelatorio();

  useEffect(() => {
    const relatorioId = route.params.relatorioId;
    const existingRelatorio = relatorios.find((r) => r!.id === relatorioId);
    setRelatorio({ ...existingRelatorio });
  }, [relatorios]);

  const handleChange = (name: string, value: string) => {
    setRelatorio({ ...relatorio, [name]: value });
  };

  const [visible, setVisible] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  // const relatorios = useRoute().params
  const handleSaveRelatorio = async () => {
    await saveRelatorio(relatorio);
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
      assinaturaURI: relatorio?.assinaturaURI,
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
