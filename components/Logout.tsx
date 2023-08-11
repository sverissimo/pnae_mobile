import { Pressable, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function LogoutComponent({ onLogout: logoutHandler }: { onLogout: () => void }) {
  return (
    <Pressable onPress={logoutHandler} style={styles.container}>
      <Ionicons name="exit-outline" size={24} color="white" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: "2%",
  },
});
