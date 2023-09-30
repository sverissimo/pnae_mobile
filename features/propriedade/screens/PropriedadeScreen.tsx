import { View, StyleSheet } from "react-native";
import { PropriedadesList } from "../components/PropriedadeList";
import { ProdutorInfo, ProdutorSearchBar } from "@features/produtor/components";
import { globalColors } from "@shared/constants/themes";
import { useSelectProdutor } from "@features/produtor/hooks";
import { ListTitle } from "@shared/components/atoms";

export const PropriedadeScreen = () => {
  const { produtor } = useSelectProdutor();

  if (!produtor) {
    return (
      <View style={styles.container}>
        <ProdutorSearchBar />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProdutorInfo />
      {produtor.propriedades?.length ? (
        <>
          <ListTitle title={"Propriedades cadastradas"} />
          <PropriedadesList />
        </>
      ) : (
        <ListTitle title={"Nenhuma propriedade cadastrada"} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalColors.grayscale[50],
    //justifyContent: "flex-end",
    alignItems: "center",
  },
});
