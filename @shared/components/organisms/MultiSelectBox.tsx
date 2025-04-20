import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { FormFieldContainer } from "../molecules";
import { ButtonInputComponent } from "./ButtonInputComponent";

type MultiSelectProps = {
  options: string[];
  selectedValues?: string[];
  onSelectionChange: (selected: string[]) => void;
  label: string;
};

const MultiSelectBox: React.FC<MultiSelectProps> = ({
  options,
  selectedValues = [],
  onSelectionChange,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  // Local state for the modal session only.
  const [localSelected, setLocalSelected] = useState<string[]>([]);

  // Open modal and initialize local state with parent's selected values.
  const openModal = () => {
    setLocalSelected(selectedValues);
    setModalVisible(true);
  };

  const toggleOption = (option: string) => {
    if (localSelected.includes(option)) {
      setLocalSelected(localSelected.filter((item) => item !== option));
    } else {
      setLocalSelected([...localSelected, option]);
    }
  };

  const handleSave = () => {
    onSelectionChange(localSelected.sort());
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const renderItem = ({ item }: { item: string }) => {
    const isSelected = localSelected.includes(item);
    return (
      <TouchableOpacity
        onPress={() => toggleOption(item)}
        style={styles.optionContainer}
      >
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <View style={styles.checkedBox} />}
        </View>
        <Text style={styles.optionText}>{item}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {/* <TouchableOpacity onPress={openModal} style={styles.selector}>
        <Text style={styles.selectorText}>
          {selectedValues.length > 0
            ? selectedValues.join(", ")
            : "Selecionar temas"}
        </Text>
      </TouchableOpacity> */}
      {selectedValues.length === 0 ? (
        <ButtonInputComponent
          label="Temas do atendimento"
          fieldName="temas"
          buttonLabel="Selecionar temas"
          icon="format-list-checkbox"
          onPress={openModal}
        />
      ) : (
        <ButtonInputComponent
          label="Temas do atendimento"
          fieldName="temas"
          buttonLabel={selectedValues.join(", ")}
          icon="file-document-edit"
          onPress={openModal}
        />
      )}

      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Selecione os Temas</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={renderItem}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={handleCancel}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default MultiSelectBox;

const PRIMARY_COLOR = "#006f62"; // Example accent color (adjust as needed)

const styles = StyleSheet.create({
  selector: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  selectorText: {
    fontSize: 14,
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    width: "80%",
    maxHeight: "70%",
    borderRadius: 8,
    padding: 20,
    elevation: 5, // adds a shadow on Android
    shadowColor: "#000", // adds a shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: "center",
    fontWeight: "600",
    color: "#333",
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 4,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    borderColor: PRIMARY_COLOR,
  },
  checkedBox: {
    width: 14,
    height: 14,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 2,
  },
  optionText: {
    fontSize: 14,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: "#e5e5e5",
    marginLeft: 12,
  },
  modalButtonText: {
    fontSize: 14,
    color: "#333",
  },
});
