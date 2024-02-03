import { globalColors } from "@constants/themes";
import { Text, StyleSheet } from "react-native";

export const HelperMessage = ({
  message,
  customStyles,
}: {
  message: string;
  customStyles?: Record<string, any>;
}) => {
  return <Text style={{ ...styles.text, ...customStyles }}>{message}</Text>;
};

const styles = StyleSheet.create({
  text: {
    color: globalColors.grayscale[500],
    fontSize: 13,
    marginTop: 10,
    fontWeight: "bold",
    fontStyle: "italic",
  },
});
