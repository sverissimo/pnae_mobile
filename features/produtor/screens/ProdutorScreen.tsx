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
import { HelperMessage, ListTitle } from "@shared/components/atoms";
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
  const { propriedades, perfis } = produtor;

  return (
    <View style={styles.container}>
      <ProdutorInfo />
      <ListTitle title={"Dados do Produtor"} />
      <ProdutorDetails />

      {propriedades?.length ? (
        <>
          <ListTitle title="Propriedades cadastradas" />
          <PropriedadesList />
        </>
      ) : (
        <HelperMessage message={"Nenhuma propriedade cadastrada"} />
      )}

      {perfis?.length > 0 ? (
        <>
          <ListTitle title={"Perfis cadastrados"} />
          <PerfilList data={produtor.perfis || []} />
        </>
      ) : (
        <HelperMessage message={"Nenhum perfil cadastrado"} />
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
