import { useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { Button } from "react-native-paper";
import { FormTemplate } from "@shared/components/templates";
import { ListTitle } from "@shared/components/atoms";
import { perfilForm } from "../forms/perfilForm";

type PerfilFormState = {
  tipoPerfil: string;
  participaOrganizacao: boolean;
  // ... other state variables
};

export const CreatePerfilScreen: React.FC = () => {
  const [state, setState] = useState<any>({});
  console.log("🚀 ~ file: CreatePerfilScreen.tsx:23 ~ state:", state);

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
      <Button
        mode="contained"
        style={styles.button}
        onPress={() => console.log("Submitted")}
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
});
