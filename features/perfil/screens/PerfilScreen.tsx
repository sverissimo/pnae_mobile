import { View, StyleSheet } from "react-native";
import { globalColors } from "../../../@shared/constants/themes";
import { ProdutorSearchBar } from "../../produtor/components/ProdutorSearchBar";
import { ProdutorInfo } from "../../produtor/components/ProdutorInfo";
import { useSelectProdutor } from "@features/produtor/hooks";
import { AddButton, ListTitle } from "@shared/components/atoms";
import { useManagePerfil } from "../hooks/useManagePerfil";
import PerfilList from "../components/PerfilList";

export const PerfilScreen = () => {
  const { produtor } = useSelectProdutor();
  const { perfis, handleCreatePerfil, handleViewPerfil, handleEditPerfil } =
    useManagePerfil(produtor);

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
      {produtor.perfis?.length ? (
        <>
          <ListTitle title={"Perfis cadastrados"} />
          <PerfilList
            data={perfis}
            handleViewPerfil={handleViewPerfil}
            handleEditPerfil={handleEditPerfil}
          />
        </>
      ) : (
        <ListTitle title={"Nenhum perfil cadastrado"} />
      )}

      <AddButton label="Criar Novo Perfil" onPress={handleCreatePerfil} />
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
