import { ScrollView, StyleSheet } from "react-native";
import { ListTitle } from "../../../components/atoms/ListTitle";
import { FormTemplate } from "../../../components/templates/FormTemplate";
import { Button } from "react-native-paper";
import { relatorioForm } from "../relatorioForm";
import { useManageRelatorio } from "../hooks/useManageRelatorios";

export const CreateRelatorioScreen = () => {
  const { relatorio, handleChange, setRelatorio } = useManageRelatorio();

  return (
    <ScrollView style={styles.container}>
      <ListTitle title="Preencha as informações abaixo" />
      <FormTemplate
        form={relatorioForm}
        data={relatorio}
        onValueChange={handleChange}
      />
      <Button mode="contained" style={styles.button} onPress={setRelatorio}>
        Salvar
      </Button>
    </ScrollView>
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

/*
<>
<TextInput
        placeholder="Número do Relatório"
        value={numeroRelatorio}
        onChangeText={setNumeroRelatorio}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Assunto"
        value={assunto}
        onChangeText={setAssunto}
        style={styles.input}
      />
      <TextInput
        placeholder="Orientação"
        value={orientacao}
        onChangeText={setOrientacao}
        style={styles.input}
      />
      <TextInput
        placeholder="ID do Produtor"
        value={produtorId}
        onChangeText={setProdutorId}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="ID do Técnico"
        value={tecnicoId}
        onChangeText={setTecnicoId}
        keyboardType="numeric"
        style={styles.input}
      />
      <Pressable onPress={handleSubmit} style={styles.button}>

        <Text style={styles.buttonText}>Submit</Text>
      </Pressable>
</> */
