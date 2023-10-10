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
import { Loading } from "@shared/components/organisms";

export const ProdutorScreen = () => {
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
      <PerfilList data={produtor.perfis || []} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalColors.grayscale[50],
    alignItems: "center",
  },
  title: {
    marginLeft: "2%",
  },
});
