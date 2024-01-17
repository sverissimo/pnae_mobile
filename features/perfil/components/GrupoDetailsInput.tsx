import { GrupoDetails, ProdutoDetails } from "@domain/perfil";
import { FormTemplate } from "@shared/components/templates";
import { Text, View, StyleSheet } from "react-native";
import { produtoDetailsForm } from "../constants/produtoDetailsForm";
import { toCapitalCase } from "@shared/utils/formatStrings";
import { globalColors } from "@constants/themes";
import { Icon } from "@shared/components/atoms";

type GrupoDetailsInputProps = {
  selectedGrupo: GrupoDetails;
  selectedProdutos: ProdutoDetails[];
  groupIndex: number;
  onValueChange: (field: string, value: any, groupIndex: number) => void;
  removeProduto: (produto: ProdutoDetails) => void;
};

export const GrupoDetailsInput = ({
  selectedGrupo,
  selectedProdutos,
  groupIndex,
  onValueChange: handleChange,
  removeProduto,
}: GrupoDetailsInputProps) => {
  const onValueChange = (field: string, value: any) => {
    handleChange(field, value, groupIndex);
  };

  return (
    <View style={styles.container}>
      <View style={styles.formColumn}>
        <FormTemplate
          form={produtoDetailsForm}
          data={selectedGrupo}
          onValueChange={(field: string, value: string) =>
            onValueChange(field, value)
          }
          customStyles={styles.input}
        />
      </View>

      <View style={styles.productList}>
        {selectedProdutos &&
          selectedProdutos.length > 0 &&
          selectedProdutos
            .filter((produto) => !!produto?.nm_produto)
            .map((produto) => (
              <View key={produto.nm_produto} style={styles.productRow}>
                <Text style={styles.productText}>
                  {toCapitalCase(produto.nm_produto)}
                </Text>
                <Icon
                  iconName="trash"
                  color="grey"
                  size={18}
                  onPress={() => removeProduto(produto)}
                />
              </View>
            ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  productList: {
    padding: "2%",
    justifyContent: "center",
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "3%",
    gap: 8,
  },
});
