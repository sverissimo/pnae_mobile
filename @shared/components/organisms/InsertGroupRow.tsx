import { View, StyleSheet } from "react-native";
import { FormElement } from "@shared/types";
import { ButtonInputComponent } from "./ButtonInputComponent";
import { useCustomNavigation } from "@navigation/hooks";
import { GruposProdutosTable } from "@features/perfil/components";
import { GrupoProdutos } from "@domain/perfil";
import { CustomButton } from "../atoms";

type InsertGroupRowProps<T> = {
  item: FormElement;
  selectedItems?: string[] | GrupoProdutos[];
  onPressButton?: () => void;
};

export const InsertGroupRow = <T extends Object>({
  item,
  selectedItems,
}: InsertGroupRowProps<T>) => {
  const { navigation } = useCustomNavigation();

  const handlePress = async () => {
    navigation.navigate("InsertGroupScreen", {
      item,
      selectedItems,
      parentRoute: "CreatePerfilScreen",
    });
  };

  return (
    <>
      {selectedItems?.length ? (
        <View style={styles.container}>
          <GruposProdutosTable
            grupoProdutos={selectedItems as GrupoProdutos[]}
            type={
              item.field === "gruposNaturaOptions" ? "inNatura" : "industrial"
            }
          />
          <CustomButton
            label="Alterar grupos"
            icon="file-document-edit"
            mode="text"
            onPress={handlePress}
            style={styles.button}
          />
        </View>
      ) : (
        <ButtonInputComponent
          key={item.field}
          label={item.label}
          fieldName={item.field}
          buttonLabel={
            !selectedItems?.length
              ? "Inserir grupos de produtos"
              : "Alterar grupos"
          }
          icon={
            !selectedItems?.length
              ? "application-edit-outline"
              : "file-document-edit"
          }
          onPress={handlePress}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  button: {
    marginTop: -5,
    alignSelf: "flex-end",
  },
});
