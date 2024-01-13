import { StyleSheet, Text, View } from "react-native";

type FormFieldContainerProps = {
  label: string;
  children: React.ReactNode;
  customStyles?: Record<string, number | string>;
};
export const FormFieldContainer = ({
  label,
  children,
  customStyles = {},
}: FormFieldContainerProps) => {
  return (
    <View style={styles.container}>
      <Text style={{ ...styles.label, ...customStyles }}>{label}</Text>
      <View style={styles.children}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: "2%",
    marginBottom: "1%",
    marginHorizontal: "2%",
    alignItems: "center",
  },
  label: {
    flex: 1,
    width: "25%",
    fontSize: 12,
  },
  children: {
    flex: 2,
  },
});
