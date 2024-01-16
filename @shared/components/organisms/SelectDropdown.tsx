import { StyleSheet, ScrollView } from "react-native";
import SelectDropDownNative from "react-native-select-dropdown";
import { FormFieldContainer } from "../molecules";
import { Icon } from "../atoms";

type SelectDropdownProps = {
  label: string;
  options: any;
  onSelect: any;
};
export const SelectDropdown = ({
  label,
  options,
  onSelect,
}: SelectDropdownProps) => {
  return (
    <FormFieldContainer key={label} label={label}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical={false}
        contentContainerStyle={styles.scrollViewContainer}
      >
        <SelectDropDownNative
          data={options}
          onSelect={(selectedItem, index) => {
            console.log(selectedItem, index);
            onSelect(selectedItem);
          }}
          defaultButtonText={"Selecionar"}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem;
          }}
          rowTextForSelection={(item, index) => {
            return item;
          }}
          buttonStyle={styles.btn}
          buttonTextStyle={styles.btnText}
          renderDropdownIcon={(isOpened) => {
            return (
              <Icon
                iconName={isOpened ? "chevron-up" : "chevron-down"}
                color={"#444"}
                size={18}
              />
            );
          }}
          dropdownIconPosition={"right"}
          dropdownStyle={styles.dropdown}
          rowStyle={styles.row}
          rowTextStyle={styles.rowText}
        />
      </ScrollView>
    </FormFieldContainer>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingVertical: "1%",
    paddingBottom: "2%",
  },

  btn: {
    width: "100%",
    height: 30,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#444",
  },
  btnText: { color: "#444", textAlign: "left", fontSize: 12 },
  dropdown: { backgroundColor: "#EFEFEF" },
  row: {
    backgroundColor: "#EFEFEF",
    borderBottomColor: "#C5C5C5",
  },
  rowText: { color: "#444", textAlign: "left", fontSize: 13 },
});
