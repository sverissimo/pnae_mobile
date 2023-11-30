import { useState } from "react";
import { View } from "react-native";
import MultiSelect from "react-native-multiple-select";

export const MultiSelectComp = (props: any) => {
  const { items } = props;
  const [selectedItems, setSelectedItems] = useState<any>([]);
  const onSelectedItemsChange = (selectedItems: any) => {
    // Set Selected Items
    setSelectedItems({ selectedItems });
  };

  return (
    <View style={{ flex: 1 }}>
      <MultiSelect
        hideTags
        items={items}
        uniqueKey="id"
        // ref={(component) => { this.multiSelect = component }}
        onSelectedItemsChange={onSelectedItemsChange}
        selectedItems={selectedItems}
        selectText="Pick Items"
        searchInputPlaceholderText="Search Items..."
        onChangeInput={(text) => console.log(text)}
        altFontFamily="ProximaNova-Light"
        tagRemoveIconColor="#CCC"
        tagBorderColor="#CCC"
        tagTextColor="#CCC"
        selectedItemTextColor="#CCC"
        selectedItemIconColor="#CCC"
        itemTextColor="#000"
        displayKey="name"
        searchInputStyle={{ color: "#CCC" }}
        submitButtonColor="#CCC"
        submitButtonText="Submit"

        // flatListProps={{}}
      />
    </View>
  );
};
