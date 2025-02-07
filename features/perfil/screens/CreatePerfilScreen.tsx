import { useEffect, useState } from "react";
import { StyleSheet, ScrollView, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { useManagePerfil } from "../hooks/useManagePerfil";
import { useCustomNavigation } from "@navigation/hooks";
import { useSnackBar } from "@shared/hooks";
import { FormTemplate } from "@shared/components/templates";
import { ListTitle } from "@shared/components/atoms";
import { perfilForm } from "../constants";
import { PerfilInputDTO } from "@services/perfil/dto/PerfilInputDTO";
import { FormElement } from "@shared/types";
import { usePerfilPermissions } from "../hooks/usePerfilPermissions";

export const CreatePerfilScreen: React.FC = ({ route }: any) => {
  const { key, selectedItems } = route?.params || {};
  const { navigation } = useCustomNavigation();
  const { setSnackBarOptions } = useSnackBar();

  const { tipoPerfil } = usePerfilPermissions();
  const {
    producaoNaturaForm,
    producaoIndustrialForm,
    perfil,
    setPerfil,
    savePerfil,
    missingFields,
  } = useManagePerfil();

  const [enableSave, setEnableSave] = useState<boolean>(true);

  // Fills the form with the selected items from the previous screen
  useEffect(() => {
    if (key && selectedItems) {
      setPerfil((perfil: PerfilInputDTO) => ({
        ...perfil,
        [key]: selectedItems,
      }));
    }
  }, [key, selectedItems]);

  const handleChange = <K extends keyof PerfilInputDTO>(
    name: K,
    value: string
  ) => {
    setPerfil((perfil: PerfilInputDTO) => ({ ...perfil, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setEnableSave(false);
      await savePerfil(tipoPerfil);

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
        data={perfil}
        onValueChange={handleChange}
      />

      {(perfil.atividade === "Atividade Primária" ||
        perfil.atividade === "Ambas") && (
        <View style={styles.formContainer}>
          <Text style={styles.subTitle}>Dados de produção em natura</Text>
          <FormTemplate
            form={producaoNaturaForm}
            data={perfil}
            onValueChange={handleChange}
          />
        </View>
      )}

      {(perfil.atividade === "Atividade Secundária" || // || true) && (
        perfil.atividade === "Ambas") && (
        <View style={styles.formContainer}>
          <Text style={styles.subTitle}>Dados de produção industrial</Text>
          <FormTemplate
            form={producaoIndustrialForm}
            data={perfil}
            onValueChange={handleChange}
          />
        </View>
      )}

      <Button
        mode="contained"
        style={styles.button}
        onPress={handleSave}
        disabled={!enableSave || !perfil.atividade || missingFields.length > 0}
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
