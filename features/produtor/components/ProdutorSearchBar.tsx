import React, { useState } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { Searchbar } from "react-native-paper";
import { useSelectProdutor } from "../hooks/useSelectProdutor";
import { Icon } from "../../../components/atoms/Icon";
import { globalColors } from "../../../constants/themes";
import { getProdutorData } from "../../../api/produtorAPI";

export function ProdutorSearchBar() {
  const [searchQuery, setSearchQuery] = useState("");

  const { setProdutor } = useSelectProdutor();

  const onChangeSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleSubmit = async () => {
    const data = await getProdutorData(searchQuery);
    console.log(
      "🚀 ~ file: ProdutorSearchBar.tsx:21 ~ handleSubmit ~ data:",
      data.perfis
    );
    setProdutor(data);
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
    backgroundColor: globalColors.grayscale[50],
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
