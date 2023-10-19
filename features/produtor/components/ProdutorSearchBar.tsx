import React, { useState } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { Searchbar } from "react-native-paper";
import { useSelectProdutor } from "../hooks/useSelectProdutor";
import { Icon } from "@shared/components/atoms";
import { globalColors } from "../../../@shared/constants/themes";
import { formatCPForCNPJ } from "@shared/utils/cpfUtils";

const { primary, grayscale } = globalColors;
export function ProdutorSearchBar() {
  const { fetchProdutor, isLoading } = useSelectProdutor();
  const [CPFProdutor, setCPFProdutor] = useState("");

  const onChangeSearch = (value: string) => {
    const formattedCPForCNPJ = formatCPForCNPJ(value);
    setCPFProdutor(formattedCPForCNPJ);
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Digite o CPF do Produtor"
        keyboardType="numeric"
        onChangeText={onChangeSearch}
        value={CPFProdutor}
        style={styles.input}
      />
      <Pressable
        style={{
          ...styles.button,
          backgroundColor: isLoading
            ? styles.button.disabledBackground
            : styles.button.backgroundColor,
        }}
        disabled={isLoading}
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
    backgroundColor: grayscale[50],
  },
  chip: {
    backgroundColor: grayscale[200],
    borderRadius: 20,
  },
  inputContainer: {},
  button: {
    backgroundColor: primary[600],
    disabledBackground: grayscale[300],
    padding: 8,
    borderRadius: 25,
  },
  icon: {},
});
