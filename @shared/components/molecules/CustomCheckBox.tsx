import { View } from "react-native";
import { Checkbox, Text } from "react-native-paper";

interface CheckboxListProps {
  item: string;
  selected: boolean;
  onSelectionChange: (selectedItems: string) => void;
}

export const CustomCheckbox = ({
  item,
  selected,
  onSelectionChange,
}: CheckboxListProps) => {
  return (
    <View
      key={item}
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 8,
      }}
    >
      <Checkbox
        status={selected ? "checked" : "unchecked"}
        onPress={() => onSelectionChange(item)}
      />
      <Text>{item}</Text>
    </View>
  );
};
