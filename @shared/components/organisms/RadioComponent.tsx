import { StyleSheet, Text, View } from "react-native";
import { RadioButton } from "react-native-paper";
import { FormFieldContainer } from "../molecules";

export const RadioComponent = (props: any) => {
  const { onValueChange, value, label } = props;
  return (
    <FormFieldContainer label={label}>
      <RadioButton.Group
        onValueChange={(value) => onValueChange(value)}
        value={value}
      >
        <View style={{ flexDirection: "row" }}>
          <View style={{ flexDirection: "row" }}>
            <RadioButton.Item
              value="true"
              label="Sim"
              style={styles.radioItem}
            />
          </View>
          <View style={{ flexDirection: "row" }}>
            <RadioButton.Item
              value="false"
              label="Não"
              style={styles.radioItem}
            />
          </View>
        </View>
      </RadioButton.Group>
    </FormFieldContainer>
  );
};

const styles = StyleSheet.create({
  radioItem: {
    transform: [{ scale: 0.9 }],
    paddingLeft: 0,
    alignSelf: "flex-start",
    //transform: [{ scale: 0.8 }, { translateX: -10 }],
  },
});
