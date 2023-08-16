import { Text, View, StyleSheet } from "react-native";
import { useSelectProdutor } from "../hooks/useSelectProdutor";
import { ProdutorSearchBar } from "../components/ProdutorSearchBar";
import { ProdutorInfo } from "../components/ProdutorInfo";
import PerfilList from "../../perfil/components/PerfilList";
import { RelatorioList } from "../../relatorio/components/RelatorioList";
import { PropriedadesList } from "../../propriedade/components/PropriedadeList";
import { globalColors } from "../../../constants/themes";
import { ListTitle } from "components/atoms/ListTitle";
import { ProdutorDetails } from "../components/ProdutorDetails";

export const ProdutorScreen = () => {
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
      <View style={styles.title}>
        <ListTitle title={"Dados do Produtor"} />
      </View>
      <ProdutorDetails />
      <View style={styles.title}>
        <ListTitle title={"Propriedades cadastradas"} />
      </View>
      <PropriedadesList />
      <View style={styles.title}>
        <ListTitle title={"Perfis cadastrados"} />
      </View>
      <PerfilList />
      <RelatorioList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalColors.grayscale[50],
    //justifyContent: "flex-end",
    //alignItems: "center",
  },
  title: {
    marginLeft: "2%",
  },
});
