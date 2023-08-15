import { useState } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { TextInput, RadioButton, Button, Menu } from "react-native-paper";
import { Provider as PaperProvider } from "react-native-paper";
import { RadioComponent } from "../../../components/organisms/RadioComponent";
import { SelectDropdown } from "../../../components/organisms/SelectDropdown";
import { ListTitle } from "../../../components/atoms/ListTitle";
import { FormTemplate } from "../../../components/templates/FormTemplate";
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
