import { GrupoDetails, ProdutoDetails } from "@domain/perfil";
import { FormTemplate } from "@shared/components/templates";
import { Text, View, StyleSheet } from "react-native";
import { produtoDetailsForm } from "../constants/produtoDetailsForm";
import { toCapitalCase } from "@shared/utils/formatStrings";
import { globalColors } from "@constants/themes";

type ProdutosDetailsInputProps = {
  selectedProduto: ProdutoDetails;
  onValueChange: (field: string, value: any) => void;
};

export const ProdutosDetailsInput = ({
  selectedProduto,
  onValueChange,
}: ProdutosDetailsInputProps) => {
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
          data={{}}
          onValueChange={onValueChange}
          customStyles={styles.input}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: globalColors.primary[50],
    margin: 10,
    padding: 4,
    borderRadius: 8,
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
});
