import { useEffect } from "react";

import { useCustomNavigation } from "navigation/hooks/useCustomNavigation";
import { useLocation } from "@shared/hooks";
import { ScrollView, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

import { ListTitle } from "@shared/components/atoms";
import { FormTemplate } from "@shared/components/templates";
import { useManagePictures, useSnackBar } from "@shared/hooks";

import { relatorioForm } from "../constants";
import { useManageRelatorio } from "../hooks";

export const CreateRelatorioScreen = ({ route }: any) => {
  const { navigation } = useCustomNavigation();
  const { setSnackBarOptions } = useSnackBar();
  const { updateLocation } = useLocation();
  const { pictureURI, assinaturaURI, clearURIs } = useManagePictures();
  const { relatorio, handleChange, saveRelatorio, enableSave, setEnableSave } =
    useManageRelatorio();

  useEffect(() => {
    clearURIs();
  }, []);

  useEffect(() => {
    const { HTMLText } = route.params || {};
    if (HTMLText) {
      handleChange("orientacao", HTMLText);
    }
  }, [route.params]);

  useEffect(() => {
    if (pictureURI) {
      (async () => {
        await updateLocation();
      })();
    }
  }, [pictureURI]);

  const handleSaveRelatorio = async () => {
    try {
      await saveRelatorio({ ...relatorio, pictureURI, assinaturaURI });
      setSnackBarOptions({
        message: "Relatório salvo com sucesso!",
        status: "success",
        duration: 1000,
      });
      setEnableSave(false);
      setTimeout(() => {
        navigation.goBack();
      }, 900);
    } catch (error: Error | any) {
      setSnackBarOptions({
        status: "error",
        message: error?.message || "Erro ao salvar relatório",
      });
      console.log("🚀 CreateRelatorioScreen.tsx:59: ", error);
    }
  };

  const navigateTo = (route: string) => {
    navigation.navigate(route, {
      parentRoute: "CreateRelatorioScreen",
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
