import { View, StyleSheet } from "react-native";
import { useSelectProdutor } from "../hooks/useSelectProdutor";
import { ProdutorSearchBar } from "../components/ProdutorSearchBar";
import { ProdutorInfo } from "../components/ProdutorInfo";
import PerfilList from "../../perfil/components/PerfilList";
import { PropriedadesList } from "../../propriedade/components/PropriedadeList";
import { globalColors } from "../../../constants/themes";
import { ProdutorDetails } from "../components/ProdutorDetails";
import { ListTitle } from "@shared/components/atoms";

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalColors.grayscale[50],
  },
  title: {
    marginLeft: "2%",
  },
});
