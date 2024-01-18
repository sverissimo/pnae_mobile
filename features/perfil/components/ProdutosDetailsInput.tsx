import { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { ProdutoDetails } from "@domain/perfil";
import { FormTemplate } from "@shared/components/templates";
import { produtoDetailsForm } from "../constants/produtoDetailsForm";
import { toCapitalCase } from "@shared/utils/formatStrings";
import { globalColors } from "@constants/themes";
import { Icon } from "@shared/components/atoms";

type ProdutosDetailsInputProps = {
  selectedProduto: ProdutoDetails;
  groupIndex: number;
  productIndex: number;
  onValueChange: (
    field: string,
    value: any,
    groupIndex: number,
    productIndex: number
  ) => void;
  removeProduto: (produto: ProdutoDetails) => void;
};

export const ProdutosDetailsInput = ({
  selectedProduto,
  groupIndex,
  productIndex,
  onValueChange: handleChange,
  removeProduto,
}: ProdutosDetailsInputProps) => {
  const onValueChange = (field: string, value: any) => {
    handleChange(field, value, groupIndex, productIndex);
  };

  const [form, updateForm] = useState(produtoDetailsForm);

  useEffect(() => {
    const updatedForm =
      selectedProduto?.tipo === 0
        ? produtoDetailsForm.filter((item) => item.field !== "area_utilizada")
        : produtoDetailsForm;
    updateForm(updatedForm);
  }, [selectedProduto]);

  return (
    <View style={styles.container}>
      <View style={styles.produtoColumn}>
        <Text style={styles.productText}>
          {toCapitalCase(selectedProduto.nm_produto)}
        </Text>
      </View>
      <View style={styles.formColumn}>
        <FormTemplate
          form={form}
          data={selectedProduto}
          onValueChange={(field: string, value: string) =>
            onValueChange(field, value)
          }
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
