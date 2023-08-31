import { View, StyleSheet } from "react-native";
import { useSelectProdutor } from "../hooks";
import {
  ProdutorDetails,
  ProdutorInfo,
  ProdutorSearchBar,
} from "../components";
import PerfilList from "@features/perfil/components/PerfilList";
import { PropriedadesList } from "@features/propriedade/components/PropriedadeList";
import { globalColors } from "@shared/constants/themes";
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
