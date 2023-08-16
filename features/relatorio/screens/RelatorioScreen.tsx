import { View, StyleSheet } from "react-native";
import { globalColors } from "../../../constants/themes";
import { ProdutorSearchBar } from "../../produtor/components/ProdutorSearchBar";
import { ProdutorInfo } from "../../produtor/components/ProdutorInfo";
import { useSelectProdutor } from "../../produtor/hooks/useSelectProdutor";
import { RelatorioList } from "../components/RelatorioList";
import { useCustomNavigation } from "../../../hooks/useCustomNavigation";
import { ListTitle } from "../../../components/atoms/ListTitle";
import { AddButton } from "../../../components/atoms/AddButton";
import { useManageRelatorio } from "../hooks/useManageRelatorios";

export const RelatorioScreen = () => {
  const { produtor } = useSelectProdutor();
  const { navigation } = useCustomNavigation();
  const { relatorios } = useManageRelatorio(produtor?.id_pessoa_demeter!);

  const handlePress = () => {
    navigation.navigate("CreateRelatorioScreen");
  };
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
      {relatorios?.length ? (
        <>
          <ListTitle title={"Relatorios cadastrados"} />
          <RelatorioList relatorios={relatorios} />
        </>
      ) : (
        <ListTitle title={"Nenhum relatório cadastrado"} />
      )}
      <AddButton label="Criar Novo Relatório" onPress={handlePress} />
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
