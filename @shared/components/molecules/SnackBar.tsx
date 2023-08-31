// write a toast component using react-native-easy-toast or react-native-paper
import { Snackbar } from "react-native-paper";
import { StyleSheet } from "react-native";

export type SnackBarProps = {
  visible: boolean;
  onDismiss: () => void;
  message: string;
  duration?: number;
  color?: string;
};

export const SnackBar = ({
  visible,
  onDismiss,
  message,
  duration,
  color,
}: SnackBarProps) => {
  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismiss}
      onIconPress={onDismiss}
      duration={duration || 600}
      action={{
        label: "",
      }}
      style={{
        ...styles.toast,
        backgroundColor: color,
      }}
    >
      {message}
    </Snackbar>
  );
};

const styles = StyleSheet.create({
  toast: {
    marginBottom: "10%",
  },
});
