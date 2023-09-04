import { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useCustomNavigation } from "@navigation/hooks/useCustomNavigation";
import { useManageRelatorio } from "../hooks";
import { useManagePictures, useSnackBar } from "@shared/hooks";
import { FormTemplate } from "@shared/components/templates";
import { SnackBar } from "@shared/components/molecules";
import { ListTitle } from "@shared/components/atoms";
import { relatorioForm } from "../constants";
import { Relatorio } from "../types/Relatorio";

export const EditRelatorioScreen = ({ route }: any) => {
  const { updateRelatorio } = useManageRelatorio();
  const { navigation } = useCustomNavigation();
  const { snackBarOptions, setSnackBarOptions, hideSnackBar } = useSnackBar();
  const { relatorio, setRelatorio, handleChange, relatorios } =
    useManageRelatorio();
  const {
    pictureURI,
    setPicture,
    clearDiscardedPictures,
    assinaturaURI,
    setAssinatura,
    clearURIs,
  } = useManagePictures();

  const [disableButton, setDisableButton] = useState(false);
  const { relatorioId, HTMLText } = route.params;

  useEffect(() => {
    if (HTMLText) {
      setRelatorio((relatorio) => ({ ...relatorio, orientacao: HTMLText }));
    }
  }, [HTMLText]);

  useEffect(() => {
    const originalRelatorio = relatorios.find(
      (r) => r!.id === relatorioId
    ) as Relatorio;
    if (!originalRelatorio) return;
    setRelatorio({ ...originalRelatorio });
    setPicture(originalRelatorio.pictureURI);
    setAssinatura(originalRelatorio.assinaturaURI);
  }, [relatorios]);

  useEffect(() => {
    return () => {
      const keepOriginalOnly = !disableButton;
      clearDiscardedPictures(keepOriginalOnly).then(() => clearURIs());
    };
  }, []);

  const handleSaveRelatorio = async () => {
    try {
      const updatedRelatorio = { ...relatorio, pictureURI, assinaturaURI };
      await updateRelatorio(updatedRelatorio as Relatorio);

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

  const navigateTo = (route: string) => {
    navigation.navigate(route, {
      parentRoute: "EditRelatorioScreen",
      orientacao: relatorio.orientacao,
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
          navigateTo={navigateTo}
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
