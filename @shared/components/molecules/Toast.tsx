// write a toast component using react-native-easy-toast or react-native-paper
import { Snackbar } from "react-native-paper";
import { StyleSheet } from "react-native";
import { globalColors } from "constants/themes";

type ToastProps = {
  visible: boolean;
  onDismiss: () => void;
  message: string;
  duration?: number;
};

export const Toast = ({
  visible,
  onDismiss,
  message,
  duration,
}: ToastProps) => {
  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismiss}
      onIconPress={onDismiss}
      duration={duration || 600}
      action={{
        label: "",
      }}
      style={styles.toast}
    >
      {message}
    </Snackbar>
  );
};

const styles = StyleSheet.create({
  toast: {
    backgroundColor: globalColors.secondary[500],
    marginBottom: "10%",
  },
});
