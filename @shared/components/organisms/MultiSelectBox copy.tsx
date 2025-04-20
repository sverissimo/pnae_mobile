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

type MultiSelectProps = {
  options: string[];
  selectedValues?: string[];
  onSelectionChange: (selected: string[]) => void;
  label: string;
};

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selectedValues = [],
  onSelectionChange,
  label,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  // Local state for the modal session only.
  const [localSelected, setLocalSelected] = useState<string[]>([]);
  console.log("🚀 - localSelected:", localSelected);

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
    onSelectionChange(localSelected);
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      onPress={() => toggleOption(item)}
      style={styles.optionContainer}
    >
      <View style={styles.checkbox}>
        {localSelected.includes(item) && <View style={styles.checkedBox} />}
      </View>
      <Text style={styles.optionText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <FormFieldContainer label="Temas do atendimento">
      <TouchableOpacity onPress={openModal} style={styles.selector}>
        <Text style={styles.selectorText}>
          {label}: {selectedValues.join(", ") || "Select options"}
        </Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Options</Text>
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
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={styles.modalButton}>
                <Text>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </FormFieldContainer>
  );
};

const styles = StyleSheet.create({
  selector: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  selectorText: {
    fontSize: 16,
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
    maxHeight: "80%",
    borderRadius: 8,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: "#000",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkedBox: {
    width: 14,
    height: 14,
    backgroundColor: "#000",
  },
  optionText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#ddd",
    borderRadius: 4,
  },
});

export default MultiSelect;
