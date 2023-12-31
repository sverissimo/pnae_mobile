import { StyleSheet, Pressable } from "react-native";
import { Chip } from "react-native-paper";
import { globalColors } from "../../../@shared/constants/themes";
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
  const a = produtor?.tp_sexo === "F" ? "a" : "";
  return (
    <Pressable style={styles.container}>
      <Chip style={styles.chip} {...chipProps}>
        {!produtor
          ? "Nenhum produtor selecionado"
          : `Produtor${a} - ${produtor.nm_pessoa}`}
      </Chip>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "90%",
    marginTop: "6%",
    marginBottom: "4%",
  },
  chip: {
    backgroundColor: grayscale[100],
    borderRadius: 20,
  },
});
