import { globalColors } from "@constants/themes";
import * as React from "react";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Button, Dialog, Portal, Text } from "react-native-paper";

type CustomDialogProps = {
  show: boolean;
  setShowDeleteDialog: any;
  deleteDialogTitle: string;
  deleteDialogMessage: string;
  onConfirmDelete: () => void;
};

export const CustomDialog = ({
  show,
  setShowDeleteDialog,
  deleteDialogTitle,
  deleteDialogMessage,
  onConfirmDelete,
}: CustomDialogProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(show);
  }, [show]);

  const hideDialog = () => {
    setShowDeleteDialog(false);
    setVisible(false);
  };

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={hideDialog}
        theme={{
          colors: { primary: "blue" },
        }}
      >
        <Dialog.Icon icon="alert" />
        <Dialog.Title style={styles.title}>{deleteDialogTitle}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium" style={styles.text}>
            {deleteDialogMessage}
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog}>Cancelar</Button>
          <Button onPress={() => onConfirmDelete()}>Excluir</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
  },
  text: {
    textAlign: "center",
  },
});
