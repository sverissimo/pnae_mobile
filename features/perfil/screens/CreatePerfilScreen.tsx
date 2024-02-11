import { useEffect, useState } from "react";
import { StyleSheet, ScrollView, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { useManagePerfil } from "../hooks/useManagePerfil";
import { useSelectProdutor } from "@features/produtor/hooks";
import { useCustomNavigation } from "@navigation/hooks";
import { useManageContratos } from "@shared/hooks/useManageContratos";
import { useSnackBar } from "@shared/hooks";
import { FormTemplate } from "@shared/components/templates";
import { ListTitle } from "@shared/components/atoms";
import { perfilForm } from "../constants";
import { PerfilInputDTO } from "@services/perfil/dto/PerfilInputDTO";
import { FormElement } from "@shared/types";
import perfilInput from "_mockData/perfil/createPerfilInputWrong.json";
import { log } from "@shared/utils/log";

export const CreatePerfilScreen: React.FC = ({ route }: any) => {
  const { key, selectedItems } = route?.params || {};
  const { produtor } = useSelectProdutor();
  const { navigation } = useCustomNavigation();
  const { tipoPerfil } = useManageContratos(produtor?.perfis || []);

  const { setSnackBarOptions } = useSnackBar();
  const {
    producaoNaturaForm,
    producaoIndustrialForm,
    savePerfil,
    checkForMissingProps,
    missingFields,
  } = useManagePerfil(produtor);

  const [state, setState] = useState<PerfilInputDTO>(
    {} as unknown as PerfilInputDTO
  );

  const [enableSave, setEnableSave] = useState<boolean>(true);

  useEffect(() => {
    if (key && selectedItems) {
      setState((state: any) => ({ ...state, [key]: selectedItems }));
    }
  }, [key, selectedItems]);

  useEffect(() => {
    if (tipoPerfil === "Entrada") {
      setState((state: any) => ({ ...state, tipo_perfil: "Entrada" }));
    } else if (tipoPerfil === "Saída") {
      setState((state: any) => ({ ...state, tipo_perfil: "Saída" }));
    }
  }, [tipoPerfil]);

  useEffect(() => {
    checkForMissingProps(state);
  }, [state]);

  const handleChange = <K extends keyof PerfilInputDTO>(
    name: K,
    value: string
  ) => {
    setState((state: PerfilInputDTO) => ({ ...state, [name]: value }));
  };

  const handleSave = async (perfil: PerfilInputDTO) => {
    try {
      setEnableSave(false);
      await savePerfil(perfil);

      setSnackBarOptions({
        message: "Perfil salvo com sucesso!",
        status: "success",
        duration: 1000,
      });
      setTimeout(() => {
        navigation.goBack();
      }, 900);
    } catch (error: Error | any) {
      console.log("🚀 - handleSave - error:", error);

      setSnackBarOptions({
        status: "error",
        message: "Erro ao salvar perfil",
      });
      setEnableSave(true);
    }
  };

  const removeTipoPerfilOption = (perfilForm: FormElement[]) => {
    const filteredForm = perfilForm.filter((item) =>
      tipoPerfil === "Entrada" || tipoPerfil === "Saída"
        ? item.field !== "tipo_perfil"
        : true
    );
    return filteredForm;
  };

  return (
    <ScrollView style={styles.container}>
      {tipoPerfil === "Entrada" ? (
        <ListTitle title="CADASTRO DO PERFIL DE ENTRADA" />
      ) : tipoPerfil === "Saída" ? (
        <ListTitle title="CADASTRO DO PERFIL DE SAÍDA" />
      ) : (
        <ListTitle title="Preencha as informações abaixo" />
      )}
      <FormTemplate
        form={removeTipoPerfilOption(perfilForm)}
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
        disabled={!enableSave || !state.atividade || missingFields.length > 0}
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
    marginHorizontal: "2%",
  },
  obs: {
    marginVertical: "6%",
    fontSize: 14,
    fontStyle: "italic",
    color: "red",
  },
});
