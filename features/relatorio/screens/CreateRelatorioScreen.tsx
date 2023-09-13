import { useEffect, useState } from "react";

import { useCustomNavigation } from "navigation/hooks/useCustomNavigation";
import { ScrollView, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

import { ListTitle } from "@shared/components/atoms";
import { SnackBar } from "@shared/components/molecules";
import { FormTemplate } from "@shared/components/templates";
import { useManagePictures, useSnackBar } from "@shared/hooks";

import { relatorioForm } from "../constants";
import { useManageRelatorio } from "../hooks";

export const CreateRelatorioScreen = ({ route }: any) => {
  const { relatorio, handleChange, saveRelatorio } = useManageRelatorio();
  const { navigation } = useCustomNavigation();
  const { pictureURI, assinaturaURI, clearURIs } = useManagePictures();
  const { snackBarOptions, setSnackBarOptions, hideSnackBar } = useSnackBar();
  const [disableButton, setDisableButton] = useState(false);

  useEffect(() => {
    clearURIs();
  }, []);

  useEffect(() => {
    const { HTMLText } = route.params || {};
    if (HTMLText) {
      handleChange("orientacao", HTMLText);
    }
  }, [route.params]);

  const handleSaveRelatorio = async () => {
    await saveRelatorio({ ...relatorio, pictureURI, assinaturaURI });

    setSnackBarOptions({
      message: "Relatório salvo com sucesso!",
    });
    /* setDisableButton(true);
    setTimeout(() => {
      navigation.goBack();
    }, 1000); */
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
