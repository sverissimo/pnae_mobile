import { StyleSheet, View } from "react-native";
import { HelperText, TextInput } from "react-native-paper";
import { FormFieldContainer } from "../molecules";
import { FormElement } from "@shared/types";

//create type for this component props
type TextInputComponentProps = {
  label: string;
  item: FormElement;
  value: string;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  onChangeText: (value: string) => void;
  customHelper?: string;
};

export const TextInputComponent = ({
  label,
  item,
  value,
  keyboardType,
  customHelper,
  onChangeText,
}: TextInputComponentProps) => {
  return (
    <>
      <FormFieldContainer label={label}>
        <View>
          <TextInput
            key={item.field}
            onChangeText={onChangeText}
            value={value}
            style={styles.input}
            keyboardType={keyboardType || "default"}
            placeholder={item.placeholder || ""}
            placeholderTextColor="#999"
            maxLength={item.maxLength || 100}
          />
        </View>
      </FormFieldContainer>
      <View>
        <HelperText
          type="info"
          visible={!!customHelper}
          style={styles.helperText}
        >
          {customHelper}
        </HelperText>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "white",
    height: 30,
    fontSize: 12,
  },
  helperText: {
    marginLeft: "32%",
  },
});

{
  /**** TODO: Implement this? Maybe a different component?
  const [enableInput, setEnableInput] = useState(false);
  {item.type === "toggle-input" && !enableInput ? (
        <PictureHolder
          item={item}
          data={value}
          navigateTo={() => setEnableInput(true)}
        /> */
}
