import { StyleSheet, View } from "react-native";
import { HelperText, TextInput } from "react-native-paper";
import { FormFieldContainer } from "../molecules";
import { FormElement } from "@shared/types";

type TextInputComponentProps = {
  label: string;
  item: FormElement;
  value: string;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  onChangeText: (value: string) => void;
  customHelper?: string;
  customStyles?: Record<string, number | string>;
};

export const TextInputComponent = ({
  label,
  item,
  value,
  keyboardType,
  customHelper,
  onChangeText,
  customStyles = {},
}: TextInputComponentProps) => {
  return (
    <>
      <FormFieldContainer label={label} customStyles={customStyles}>
        <View>
          <TextInput
            key={item.field}
            onChangeText={onChangeText}
            value={value}
            style={{
              ...styles.input,
              maxHeight: item.numberOfLines
                ? item.numberOfLines * 45
                : undefined,
              height: !item.numberOfLines ? 30 : undefined,
              ...(item.multiline ? { textAlignVertical: "top" } : {}),
            }}
            keyboardType={keyboardType || "default"}
            placeholder={item.placeholder || ""}
            placeholderTextColor="#999"
            maxLength={item.maxLength || 100}
            multiline={item.multiline || false}
            numberOfLines={item.numberOfLines || 1}
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
    fontSize: 12,
  },
  helperText: {
    marginLeft: "32%",
  },
});
