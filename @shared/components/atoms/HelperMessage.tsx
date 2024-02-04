import { globalColors } from "@constants/themes";
import { Text, StyleSheet, View } from "react-native";

export const HelperMessage = ({
  message,
  customStyles,
}: {
  message: string;
  customStyles?: Record<string, any>;
}) => {
  return (
    <View style={styles.container}>
      <Text style={{ ...styles.text, ...customStyles }}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: "2%",
    marginHorizontal: 20,
  },
  text: {
    marginTop: 10,
    color: globalColors.grayscale[500],
    fontSize: 13,
    fontWeight: "bold",
    fontStyle: "italic",
  },
});
