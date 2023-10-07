import { useEffect } from "react";

import { useCustomNavigation } from "navigation/hooks/useCustomNavigation";
import { useLocation } from "@shared/hooks";
import { ScrollView, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

import { ListTitle } from "@shared/components/atoms";
import { SnackBar } from "@shared/components/molecules";
import { FormTemplate } from "@shared/components/templates";
import { useManagePictures, useSnackBar } from "@shared/hooks";

import { relatorioForm } from "../constants";
import { useManageRelatorio } from "../hooks";

export const CreateRelatorioScreen = ({ route }: any) => {
  const { navigation } = useCustomNavigation();
  const { updateLocation } = useLocation();
  const { pictureURI, assinaturaURI, clearURIs } = useManagePictures();
  const { relatorio, handleChange, saveRelatorio, enableSave, setEnableSave } =
    useManageRelatorio();

  const { snackBarOptions, setSnackBarOptions, hideSnackBar } = useSnackBar();

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
        const currentLocation = await updateLocation();
        console.log(
          "🚀 ~ file: PictureHolder.tsx:27 ~ handlePress ~ currentLocation:",
          currentLocation
        );
      })();
    }
  }, [pictureURI]);

  const handleSaveRelatorio = async () => {
    try {
      await saveRelatorio({ ...relatorio, pictureURI, assinaturaURI });
      setSnackBarOptions({
        message: "Relatório salvo com sucesso!",
      });
      setEnableSave(false);
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
          // disabled={!enableSave || !pictureURI || !assinaturaURI}
          // disabled={false}
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
