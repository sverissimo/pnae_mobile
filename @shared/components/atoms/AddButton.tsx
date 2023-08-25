import { StyleSheet, ViewStyle } from "react-native";
import { Button } from "react-native-paper";
import { globalColors } from "../../../constants/themes";

type AddButonProps = {
  onPress: () => void;
  label: string;
  style?: ViewStyle;
  icon?: string;
  buttonColor?: string;
  textColor?: string;
};

export const AddButton = (props: AddButonProps) => {
  return (
    <Button
      style={styles.button}
      icon="plus"
      buttonColor={globalColors.primary[500]}
      textColor="white"
      {...props}
      //icon="file-plus-outline"
      //icon="pen-plus"
      //buttonColor={globalColors.primary[100]}
      //textColor="black"
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
