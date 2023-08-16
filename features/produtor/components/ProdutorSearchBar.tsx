import React, { useState } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { Searchbar } from "react-native-paper";
import { useSelectProdutor } from "../hooks/useSelectProdutor";
import { Icon } from "../../../components/atoms/Icon";
import { globalColors } from "../../../constants/themes";

export function ProdutorSearchBar() {
  const { fetchProdutor } = useSelectProdutor();
  const [CPFProdutor, setCPFProdutor] = useState("");

  const onChangeSearch = (value: string) => {
    setCPFProdutor(value);
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Digite o CPF do Produtor"
        onChangeText={onChangeSearch}
        value={CPFProdutor}
        style={styles.input}
      />
      <Pressable
        style={styles.button}
        onPress={() => fetchProdutor(CPFProdutor)}
      >
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
