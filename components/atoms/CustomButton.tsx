import { StyleSheet, ViewStyle } from "react-native";
import { Button } from "react-native-paper";
import { globalColors } from "../../constants/themes";

type CustomButtonProps = {
  onPress: () => void;
  label?: string;
  style?: ViewStyle;
  icon?: string;
  buttonColor?: string;
  textColor?: string;
  mode?: "text" | "outlined" | "contained";
};

export const CustomButton = (props: CustomButtonProps) => {
  console.log("🚀 ~ file: CustomButton.tsx:16 ~ CustomButton ~ props:", props);
  return (
    <Button
      style={styles.button}
      icon="camera"
      contentStyle={props.style}
      mode="text"
      {...props}
      //textColor={globalColors.primary[600]}
      //buttonColor={globalColors.primary[500]}
    >
      {props.label}
    </Button>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    // marginTop: "5%",
  },
});
