import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { globalColors } from "../../constants/themes";

export function LogoutComponent({
  onLogout: logoutHandler,
}: {
  onLogout: () => void;
}) {
  return (
    <Pressable onPress={logoutHandler} style={styles.container}>
      <Ionicons name="exit-outline" size={24} color={globalColors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: "2%",
  },
});
