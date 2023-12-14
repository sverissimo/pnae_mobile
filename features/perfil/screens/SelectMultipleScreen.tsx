import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useCustomNavigation } from "@navigation/hooks";
import { CustomCheckbox } from "@shared/components/molecules/CustomCheckBox";
import { Icon } from "@shared/components/atoms";

export const SelectMultipleScreen = ({ route }: any) => {
  const { parentRoute, item, selectedItems: data } = route.params;
  const { navigation } = useCustomNavigation();
  const { options } = item;

  const [selectedItems, setSelectedItems] = useState<string[]>(data || []);

  useEffect(() => {
    navigation.setOptions({
      title: item.label,
      headerLeft: () => (
        <View style={{ marginRight: 30 }}>
          <Icon iconName="arrow-back" size={26} onPress={handleBackPress} />
        </View>
      ),
    });
  }, [navigation, selectedItems]);

  const handleBackPress = () => {
    navigation.navigate(parentRoute, { key: item.field, selectedItems });
  };

  const handleCheck = (item: string) => {
    const updatedSelectedItems = selectedItems.includes(item)
      ? selectedItems.filter((i) => i !== item)
      : [...selectedItems, item];

    setSelectedItems(updatedSelectedItems);
  };

  return (
    <View style={styles.container}>
      {options.map((option: string) => (
        <CustomCheckbox
          key={option}
          item={option}
          selected={selectedItems.includes(option)}
          onSelectionChange={handleCheck}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 11,
  },
});
