import { useState } from "react";
import { StyleSheet, ScrollView, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { FormTemplate } from "@shared/components/templates";
import { ListTitle } from "@shared/components/atoms";
import { perfilForm } from "../constants";
import { useManagePerfil } from "../hooks/useManagePerfil";

export const CreatePerfilScreen: React.FC = () => {
  const [state, setState] = useState<any>({});
  const { producaoNaturaForm, producaoIndustrialForm } = useManagePerfil();

  const handleChange = (name: string, value: any) => {
    setState((state: any) => ({ ...state, [name]: value }));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.obs}>
        * Funcionalidade em desenvolvimento, aguarde a próxima versão do app.
      </Text>
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

      {(state.atividade === "Atividade Secundária" ||
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
        onPress={() => console.log("Submitted")}
        disabled
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
