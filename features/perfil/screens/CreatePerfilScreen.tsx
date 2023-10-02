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
  const createPerfilForm = [
    ...perfilForm,
    ...producaoNaturaForm,
    ...producaoIndustrialForm,
  ];
  return (
    <ScrollView style={styles.container}>
      <ListTitle title="Preencha as informações abaixo" />
      <FormTemplate
        form={createPerfilForm}
        data={state}
        onValueChange={handleChange}
      />
      <Text>Em desenvolvimento, aguarde a próxima versão do app.</Text>
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
});
