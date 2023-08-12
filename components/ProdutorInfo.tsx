import { StyleSheet, Pressable } from "react-native";
import { Chip } from "react-native-paper";
import { globalColors } from "../constants/themes";
import { useSelectProdutor } from "../hooks/useSelectProdutor";

const { grayscale } = globalColors;

export const ProdutorInfo = () => {
  const { produtor, resetProdutor } = useSelectProdutor();

  const handlePress = () => {
    if (produtor) {
      resetProdutor();
    }
  };
  const chipProps = produtor
    ? {
        textStyle: { color: grayscale[700] },
        closeIcon: "close",
        onClose: handlePress,
      }
    : { textStyle: { color: grayscale[600] } };

  return (
    <Pressable style={styles.container}>
      <Chip style={styles.chip} {...chipProps}>
        {!produtor
          ? "Nenhum produtor selecionado"
          : `Produtor - ${produtor.produtorName}`}
      </Chip>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "90%",
    marginVertical: "6%",
  },
  chip: {
    backgroundColor: grayscale[100],
    borderRadius: 20,
  },
});
