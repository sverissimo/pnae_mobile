import { StyleSheet, View } from "react-native";
import { TextInput } from "react-native-paper";
import { FormFieldContainer } from "../molecules/FormFieldContainer";
import { FormElement } from "../../@shared/types/FormElement";

//create type for this component props
type TextInputComponentProps = {
  label: string;
  onChangeText: (value: string) => void;
  item: FormElement;
  value: string;
};

export const TextInputComponent = ({
  label,
  item,
  value,
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
