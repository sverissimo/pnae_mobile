import { View, StyleSheet } from "react-native";
import { PropriedadesList } from "../components/PropriedadeList";
import { ProdutorInfo, ProdutorSearchBar } from "@features/produtor/components";
import { globalColors } from "@shared/constants/themes";
import { useSelectProdutor } from "@features/produtor/hooks";
import { Loading } from "@shared/components/organisms";
import { HelperMessage, ListTitle } from "@shared/components/atoms";

export const PropriedadeScreen = () => {
  const { produtor, isLoading } = useSelectProdutor();

  if (!produtor) {
    return (
      <View style={styles.container}>
        <ProdutorSearchBar />
        {isLoading && <Loading />}
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
        <>
          <ListTitle title={"Nenhuma propriedade cadastrada"} />
          <HelperMessage
            message={
              "Utilize o Demeter para cadastrar uma propriedade para o produtor selecionado."
            }
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalColors.grayscale[50],

    alignItems: "center",
  },
});
