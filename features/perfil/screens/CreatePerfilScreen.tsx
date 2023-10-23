import { useState } from "react";
import { StyleSheet, ScrollView, Text } from "react-native";
import { Button } from "react-native-paper";
import { FormTemplate } from "@shared/components/templates";
import { ListTitle } from "@shared/components/atoms";
import {
  perfilForm,
  producaoIndustrialForm,
  producaoNaturaForm,
} from "../constants";

export const CreatePerfilScreen: React.FC = () => {
  const [state, setState] = useState<any>({});
  console.log("🚀 ~ file: CreatePerfilScreen.tsx:23 ~ state:", state);

  const handleChange = (name: string, value: any) => {
    setState((state: any) => ({ ...state, [name]: value }));
  };
  const createPerfilForm = [
    ...perfilForm,
    ...producaoNaturaForm,
    ...producaoIndustrialForm,
  ];
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.obs}>
        * Funcionalidade em desenvolvimento, aguarde a próxima versão do app.
      </Text>
      <ListTitle title="Preencha as informações abaixo" />
      <FormTemplate
        form={createPerfilForm}
        data={state}
        onValueChange={handleChange}
      />

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
