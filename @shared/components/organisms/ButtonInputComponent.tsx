import { StyleSheet, View } from "react-native";
import { FormFieldContainer } from "../molecules/FormFieldContainer";
import { CustomButton } from "../atoms";

type ButtonInputComponentProps = {
  label: string;
  icon: string;
  fieldName: string;
  buttonLabel: string;
  onPress: (fieldName: string) => void;
};

export const ButtonInputComponent = ({
  label,
  buttonLabel,
  icon,
  fieldName,
  onPress,
}: ButtonInputComponentProps) => {
  return (
    <FormFieldContainer label={label}>
      <View style={styles.container}>
        <CustomButton
          label={buttonLabel}
          icon={icon}
          mode="text"
          onPress={() => onPress(fieldName)}
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
