import { ProdutoDetails } from "@domain/perfil";
import { FormTemplate } from "@shared/components/templates";
import { Text, View, StyleSheet } from "react-native";
import { produtoDetailsForm } from "../constants/produtoDetailsForm";
import { toCapitalCase } from "@shared/utils/formatStrings";
import { globalColors } from "@constants/themes";
import { Icon } from "@shared/components/atoms";

type ProdutosDetailsInputProps = {
  selectedProduto: ProdutoDetails;
  setActiveProduto: (produto: ProdutoDetails) => void;
  onValueChange: (field: string, value: any) => void;
  removeProduto: (produto: ProdutoDetails) => void;
};

export const ProdutosDetailsInput = ({
  selectedProduto,
  setActiveProduto,
  onValueChange: handleChange,
  removeProduto,
}: ProdutosDetailsInputProps) => {
  const onValueChange = (field: string, value: any) => {
    setActiveProduto(selectedProduto);
    handleChange(field, value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.produtoColumn}>
        <Text style={styles.productText}>
          {toCapitalCase(selectedProduto.nm_produto)}
        </Text>
      </View>
      <View style={styles.formColumn}>
        <FormTemplate
          form={produtoDetailsForm}
          data={selectedProduto}
          onValueChange={onValueChange}
          customStyles={styles.input}
        />
      </View>
      <View style={styles.deleteIcon}>
        <Icon iconName="trash" color="grey" size={18} onPress={removeProduto} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: globalColors.primary[50],
    marginBottom: "1.5%",
    padding: "1%",
    borderRadius: 8,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
  },
  produtoColumn: {
    flexDirection: "column",
    flex: 0.2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  productText: {
    fontWeight: "500",
    fontSize: 12,
  },
  formColumn: {
    flexDirection: "column",
    flex: 0.8,
    marginRight: 10,
  },
  input: {
    fontSize: 10,
  },
  deleteIcon: {
    alignItems: "flex-end",
    marginBottom: "1%",
    marginRight: "1%",
    justifyContent: "flex-end",
  },
});
