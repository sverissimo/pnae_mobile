import { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useCustomNavigation } from "hooks/useCustomNavigation";
import { useManageRelatorio } from "../hooks/useManageRelatorios";
import { useManagePictures, useSnackBar } from "@shared/hooks";
import { FormTemplate } from "@shared/components/templates";
import { SnackBar } from "@shared/components/molecules";
import { ListTitle } from "@shared/components/atoms";
import { relatorioForm } from "../relatorioForm";
import { Relatorio } from "../types/Relatorio";

export const EditRelatorioScreen = ({ route }: any) => {
  const { updateRelatorio } = useManageRelatorio();
  const { navigation } = useCustomNavigation();
  const { relatorios } = useManageRelatorio();
  const { snackBarOptions, setSnackBarOptions, hideSnackBar } = useSnackBar();
  const {
    pictureURI,
    setPicture,
    clearDiscardedPictures,
    assinaturaURI,
    setAssinatura,
    clearURIs,
  } = useManagePictures();

  const [relatorio, setRelatorio] = useState<Partial<Relatorio>>({});
  const [disableButton, setDisableButton] = useState(false);

  const relatorioId = route.params.relatorioId;

  useEffect(() => {
    const originalRelatorio = relatorios.find(
      (r) => r!.id === relatorioId
    ) as Relatorio;
    setRelatorio({ ...originalRelatorio });
    setPicture(originalRelatorio.pictureURI);
    setAssinatura(originalRelatorio.assinaturaURI);
  }, [relatorios]);

  useEffect(() => {
    return () => {
      const keepOriginalOnly = !disableButton;
      clearDiscardedPictures(keepOriginalOnly).then(() => clearURIs());
      console.log("Component Unmounted");
    };
  }, []);

  const handleChange = (name: string, value: string) => {
    setRelatorio({ ...relatorio, [name]: value });
  };

  const handleSaveRelatorio = async () => {
    try {
      const updatedRelatorio = { ...relatorio, pictureURI, assinaturaURI };
      await updateRelatorio(updatedRelatorio as Relatorio);
      setRelatorio(updatedRelatorio);
      clearDiscardedPictures().then(() => clearURIs());

      setSnackBarOptions({
        message: "Relatório salvo com sucesso",
      });
      setDisableButton(true);
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    } catch (error) {
      setSnackBarOptions({
        status: "error",
        message: "Erro ao salvar relatório",
      });
      console.error("🚀 EditRelatorioScreen.tsx:44: ", error);
    }
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
      <SnackBar {...snackBarOptions} onDismiss={hideSnackBar} />
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
