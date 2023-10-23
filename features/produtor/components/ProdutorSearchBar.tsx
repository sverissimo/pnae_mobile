import { useState } from "react";
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
        placeholder={"Digite o CPF ou CNPJ do produtor"}
        keyboardType="numeric"
        onChangeText={onChangeSearch}
        value={CPFProdutor}
        style={styles.input}
        inputStyle={styles.inputStyle}
        placeholderTextColor={grayscale[500]}
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
    backgroundColor: primary[50],
    marginRight: "2%",
  },
  inputStyle: {
    marginRight: 0,
    fontSize: 16,
  },
  chip: {
    backgroundColor: grayscale[200],
    borderRadius: 20,
  },
  button: {
    backgroundColor: primary[600],
    disabledBackground: grayscale[300],
    padding: 8,
    borderRadius: 25,
  },
  icon: {},
});
