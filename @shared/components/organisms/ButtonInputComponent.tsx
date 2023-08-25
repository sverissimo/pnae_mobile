import { StyleSheet, View } from "react-native";
import { FormFieldContainer } from "../molecules/FormFieldContainer";
import { FormElement } from "../../types/FormElement";
import { CustomButton } from "../atoms";

type ButtonInputComponentProps = {
  label: string;
  item: FormElement;
  buttonLabel?: string | undefined;
  onPress: (field: string) => void;
};

export const ButtonInputComponent = ({
  label,
  buttonLabel,
  item,
  onPress,
}: ButtonInputComponentProps) => {
  return (
    <FormFieldContainer label={label}>
      <View style={styles.container}>
        <CustomButton
          label={buttonLabel}
          icon={item.icon}
          mode="text"
          onPress={() => onPress(item.field)}
          style={styles.button}
        />
      </View>
    </FormFieldContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    marginLeft: "4%",
  },
  button: {},
});
