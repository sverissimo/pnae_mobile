import { useEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

import { useManageRelatorio } from "../hooks";
import { useManagePictures, useSnackBar } from "@shared/hooks";
import { useCustomNavigation } from "@navigation/hooks/useCustomNavigation";
import { ListTitle } from "@shared/components/atoms";
import { FormTemplate } from "@shared/components/templates";
import { deleteFile } from "@shared/utils";
import { relatorioForm } from "../constants";
import { RelatorioModel } from "../types";

export const EditRelatorioScreen = ({ route }: any) => {
  const { navigation } = useCustomNavigation();
  const { setSnackBarOptions } = useSnackBar();

  const {
    relatorio,
    setRelatorio,
    handleChange,
    relatorios,
    enableSave,
    setEnableSave,
    updateRelatorio,
  } = useManageRelatorio();

  const {
    pictureURI,
    setPicture,
    clearDiscardedPictures,
    assinaturaURI,
    setAssinatura,
    clearURIs,
  } = useManagePictures();

  const { relatorioId, HTMLText } = route.params;

  useEffect(() => {
    if (HTMLText) {
      setRelatorio((relatorio) => ({ ...relatorio, orientacao: HTMLText }));
    }
  }, [HTMLText]);

  useEffect(() => {
    const originalRelatorio = relatorios.find(
      (r) => r!.id === relatorioId
    ) as RelatorioModel;
    if (!originalRelatorio) return;
    setRelatorio({ ...originalRelatorio });
    setPicture(originalRelatorio.pictureURI);
    setAssinatura(originalRelatorio.assinaturaURI);
  }, [relatorios]);

  useEffect(() => {
    return () => {
      const keepOriginalOnly = enableSave;
      clearDiscardedPictures(keepOriginalOnly).then(() => clearURIs());
    };
  }, []);

  const handleSaveRelatorio = async () => {
    try {
      setEnableSave(false);
      const updatedRelatorio = { ...relatorio, pictureURI, assinaturaURI };
      await updateRelatorio(updatedRelatorio as RelatorioModel);
      console.log("🚀 ~ ******************");
      await clearOldPictures();
      setSnackBarOptions({
        message: "Relatório salvo com sucesso",
        status: "success",
        duration: 1000,
      });
      setTimeout(() => {
        navigation.goBack();
      }, 900);
    } catch (error: any) {
      setSnackBarOptions({
        status: "error",
        message: error?.message,
      });
      console.log("🚀 EditRelatorioScreen.tsx:44: ", error);
    }
  };

  const navigateTo = (route: string) => {
    navigation.navigate(route, {
      parentRoute: "EditRelatorioScreen",
      orientacao: relatorio.orientacao,
    });
  };

  const clearOldPictures = async () => {
    await clearDiscardedPictures();
    clearURIs();
    const originalRelatorio = relatorios.find(
      (r) => r!.id === relatorioId
    ) as RelatorioModel;
    if (!originalRelatorio?.pictureURI || !pictureURI) return;
    if (originalRelatorio.pictureURI !== pictureURI) {
      await deleteFile(originalRelatorio.pictureURI);
    }
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
          disabled={!enableSave || !pictureURI || !assinaturaURI}
        >
          Salvar
        </Button>
      </ScrollView>
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
