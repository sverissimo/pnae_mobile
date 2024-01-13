import { Text, StyleSheet, Pressable } from "react-native";
import { FormElement } from "@shared/types";
import { ButtonInputComponent } from "./ButtonInputComponent";
import { useCustomNavigation } from "@navigation/hooks";
import { FormFieldContainer } from "../molecules";
import { globalColors } from "@constants/themes";

type InsertGroupRowProps<T> = {
  item: FormElement;
  selectedItems?: string[];
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
      {selectedItems && selectedItems?.length > 0 ? (
        <FormFieldContainer label={item.label}>
          <Pressable onPress={handlePress} style={styles.container}>
            <Text style={styles.selectedOptions}>
              {selectedItems?.join(", ")}
            </Text>
          </Pressable>
        </FormFieldContainer>
      ) : (
        <ButtonInputComponent
          key={item.field}
          label={item.label}
          fieldName={item.field}
          buttonLabel={
            !selectedItems?.length ? "Inserir grupos de produtos" : "change"
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
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    backgroundColor: globalColors.primary[50],
    borderRadius: 10,
    padding: 8,
  },
  selectedOptions: {
    fontSize: 12,
    marginLeft: 2,
    marginBottom: 2,
  },
});
