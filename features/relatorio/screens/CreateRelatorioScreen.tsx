import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";

export const CreateRelatorioScreen = ({ onSubmit }: any) => {
  const [numeroRelatorio, setNumeroRelatorio] = useState("");
  const [assunto, setAssunto] = useState("");
  const [orientacao, setOrientacao] = useState("");
  const [produtorId, setProdutorId] = useState("");
  const [tecnicoId, setTecnicoId] = useState("");

  const handleSubmit = () => {
    const relatorio = {
      numeroRelatorio: parseInt(numeroRelatorio),
      assunto,
      orientacao,
      produtorId: parseInt(produtorId),
      tecnicoId: parseInt(tecnicoId),
    };
    //onSubmit(relatorio);
    console.log(relatorio);
  };

  return (
    <View style={styles.container}>
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
    </View>
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
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
