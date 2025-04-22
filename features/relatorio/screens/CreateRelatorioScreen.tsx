import { useEffect, useRef } from "react";

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
  const { getUpdatedLocation } = useLocation();
  const { pictureURI, assinaturaURI, clearURIs } = useManagePictures();
  const { relatorio, handleChange, saveRelatorio, enableSave, setEnableSave } =
    useManageRelatorio();

  const isLocationUpdated = useRef(false);

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
    if (pictureURI && !isLocationUpdated.current) {
      const updateLocation = async () => {
        try {
          await getUpdatedLocation();
          isLocationUpdated.current = true;
        } catch (error) {
          console.log("Error getting location:", error);
          setSnackBarOptions({
            message:
              "Erro ao obter localização. Verifique as permissões do celular e certifique-se de que o GPS está ativado.",
            status: "error",
            duration: 2000,
          });
        }
      };
      updateLocation();
    }
  }, [pictureURI]);

  const handleSaveRelatorio = async () => {
    try {
      setEnableSave(false);
      await saveRelatorio({ ...relatorio, pictureURI, assinaturaURI });
      setSnackBarOptions({
        message: "Relatório salvo com sucesso!",
        status: "success",
        duration: 1000,
      });

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
