import { useEffect, useState } from "react";
import { StyleSheet, ScrollView, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { useManagePerfil } from "../hooks/useManagePerfil";
import { FormTemplate } from "@shared/components/templates";
import { ListTitle } from "@shared/components/atoms";
import { perfilForm } from "../constants";

export const CreatePerfilScreen: React.FC = ({ route }: any) => {
  const { key, selectedItems } = route?.params || {};

  const { producaoNaturaForm, producaoIndustrialForm } = useManagePerfil();
  const [state, setState] = useState<any>({});

  useEffect(() => {
    if (key && selectedItems) {
      setState((state: any) => ({ ...state, [key]: selectedItems }));
    }
  }, [key, selectedItems]);

  const handleChange = (name: string, value: any) => {
    setState((state: any) => ({ ...state, [name]: value }));
  };

  return (
    <ScrollView style={styles.container}>
      <ListTitle title="Preencha as informações abaixo" />

      <FormTemplate
        form={perfilForm}
        data={state}
        onValueChange={handleChange}
      />

      {state.atividade === "Atividade Primária" ||
        state.atividade === "Ambas" ||
        (true && (
          <View style={styles.formContainer}>
            <Text style={styles.subTitle}>Dados de produção em natura</Text>
            <FormTemplate
              form={producaoNaturaForm}
              data={state}
              onValueChange={handleChange}
            />
          </View>
        ))}

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
        onPress={() => console.log(state)}
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
