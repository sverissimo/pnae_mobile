import React, { useState } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { Searchbar } from "react-native-paper";
import { globalColors } from "../constants/themes";
import { Icon } from "./Icon";
import { useSelectProdutor } from "../hooks/useSelectProdutor";
import { grayscale } from "../constants/colorsPallete";

export function ProdutorSearchBar() {
  const [searchQuery, setSearchQuery] = useState("");

  const { getProdutor } = useSelectProdutor();

  const onChangeSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleSubmit = () => {
    getProdutor(searchQuery);
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Digite o CPF do Produtor"
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={styles.input}
      />
      <Pressable style={styles.button} onPress={handleSubmit}>
        <Icon iconName="send" size={20} color="white" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "95%",
    flexDirection: "row",
    marginVertical: "4%",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 0.2,
    marginRight: "2%",
    //backgroundColor: globalColors.primary[50],
    backgroundColor: grayscale[50],
  },
  chip: {
    backgroundColor: globalColors.grayscale[200],
    borderRadius: 20,
  },
  inputContainer: {},
  button: {
    backgroundColor: globalColors.primary[600],
    padding: 8,
    borderRadius: 25,
  },
  icon: {},
});
