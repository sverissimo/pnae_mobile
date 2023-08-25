import { StyleSheet, View } from "react-native";
import { TextInput } from "react-native-paper";
import { FormFieldContainer } from "../molecules";
import { FormElement } from "@shared/types";

//create type for this component props
type TextInputComponentProps = {
  label: string;
  onChangeText: (value: string) => void;
  item: FormElement;
  value: string;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
};

export const TextInputComponent = ({
  label,
  item,
  value,
  keyboardType,
  onChangeText,
}: TextInputComponentProps) => {
  return (
    <FormFieldContainer label={label}>
      <View>
        <TextInput
          key={item.field}
          onChangeText={onChangeText}
          value={value}
          style={styles.input}
          keyboardType={keyboardType || "default"}
        />
      </View>
    </FormFieldContainer>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "white",
    height: 30,
    fontSize: 12,
  },
});
