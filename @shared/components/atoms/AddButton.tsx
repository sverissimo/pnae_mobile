import { StyleSheet, ViewStyle } from "react-native";
import { Button } from "react-native-paper";
import { globalColors } from "../../constants/themes";

type AddButonProps = {
  onPress: () => void;
  label: string;
  style?: ViewStyle;
  icon?: string;
  buttonColor?: string;
  textColor?: string;
  disabled?: boolean;
  mode?: "text" | "outlined" | "contained";
};

export const AddButton = (props: AddButonProps) => {
  return (
    <Button
      style={{ ...styles.button, ...props.style }}
      icon="plus"
      buttonColor={globalColors.primary[500]}
      textColor="white"
      mode={props.disabled ? "outlined" : "contained"}
      {...props}
    >
      {props.label}
    </Button>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalColors.grayscale[50],
    alignItems: "center",
  },
  button: {
    marginTop: "5%",
  },
});
