import { useEffect, useState } from "react";
import { StyleSheet, ScrollView, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { useManagePerfil } from "../hooks/useManagePerfil";
import { FormTemplate } from "@shared/components/templates";
import { ListTitle } from "@shared/components/atoms";
import { perfilForm } from "../constants";
import { useSelectProdutor } from "@features/produtor/hooks";
import { useCustomNavigation } from "@navigation/hooks";
import { PerfilModel } from "@domain/perfil";
import { useSnackBar } from "@shared/hooks";
import perfInput from "_mockData/perfil/createPerfilInputComplete.json";

export const CreatePerfilScreen: React.FC = ({ route }: any) => {
  const { key, selectedItems, parent } = route?.params || {};
  const { produtor } = useSelectProdutor();
  const { navigation } = useCustomNavigation();
  const { setSnackBarOptions } = useSnackBar();
  const { producaoNaturaForm, producaoIndustrialForm, savePerfil } =
    useManagePerfil(produtor);

  const [state, setState] = useState<any>(perfInput);
  const [enableSave, setEnableSave] = useState<boolean>(true);
  console.log("🚀 - state:", JSON.stringify(state.tipo_perfil));

  useEffect(() => {
    if (key && selectedItems) {
      setState((state: any) => ({ ...state, [key]: selectedItems }));
    }
  }, [key, selectedItems]);

  const handleChange = (name: string, value: any) => {
    setState((state: any) => ({ ...state, [name]: value }));
  };

  const handleSave = async (perfil: PerfilModel) => {
    try {
      await savePerfil(perfil);
      setSnackBarOptions({
        message: "Perfil salvo com sucesso!",
        status: "success",
        duration: 1000,
      });
      // setEnableSave(false);
      setTimeout(() => {
        navigation.goBack();
      }, 900);
    } catch (error: Error | any) {
      console.log("🚀 - handleSave - error:", error);

      setSnackBarOptions({
        status: "error",
        message: "Erro ao salvar perfil",
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ListTitle title="Preencha as informações abaixo" />

      <FormTemplate
        form={perfilForm}
        data={state}
        onValueChange={handleChange}
      />

      {(state.atividade === "Atividade Primária" ||
        state.atividade === "Ambas") && (
        <View style={styles.formContainer}>
          <Text style={styles.subTitle}>Dados de produção em natura</Text>
          <FormTemplate
            form={producaoNaturaForm}
            data={state}
            onValueChange={handleChange}
          />
        </View>
      )}

      {(state.atividade === "Atividade Secundária" || // || true) && (
        state.atividade === "Ambas") && (
        <View style={styles.formContainer}>
          <Text style={styles.subTitle}>Dados de produção industrial</Text>
          <FormTemplate
            form={producaoIndustrialForm}
            data={state}
            onValueChange={handleChange}
          />
        </View>
      )}

      <Button
        mode="contained"
        style={styles.button}
        onPress={() => handleSave(state)}
        disabled={!enableSave}
      >
        Salvar
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: "2%",
  },
  formContainer: {
    marginTop: "7%",
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    paddingLeft: "2%",
    textAlign: "center",
    marginBottom: "4%",
  },
  subTitle: {
    fontSize: 15,
    fontWeight: "bold",
    paddingLeft: "2%",
  },
  button: {
    marginVertical: "6%",
  },
  obs: {
    marginVertical: "6%",
    fontSize: 14,
    fontStyle: "italic",
    color: "red",
  },
});
