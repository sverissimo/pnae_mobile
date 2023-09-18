import { View, StyleSheet } from "react-native";
import { globalColors } from "../../../@shared/constants/themes";
import { ProdutorSearchBar } from "../../produtor/components/ProdutorSearchBar";
import { ProdutorInfo } from "../../produtor/components/ProdutorInfo";
import { useSelectProdutor } from "@features/produtor/hooks";
import { AddButton, ListTitle } from "@shared/components/atoms";
import { useManagePerfil } from "../hooks/useManagePerfil";
import PerfilList from "../components/PerfilList";
import { useCustomNavigation } from "@navigation/hooks";

export const PerfilScreen = () => {
  const { produtor } = useSelectProdutor();
  const { perfis } = useManagePerfil(produtor);
  const { navigation } = useCustomNavigation();

  const handleCreatePerfil = () => {
    navigation.navigate("CreatePerfilScreen");
  };

  const handleViewPerfil = (perfilId: string) => {
    const perfil = produtor?.perfis!.find((p) => p.id === perfilId);
    const { municipio } = produtor?.propriedades![0];
    navigation.navigate("ViewPerfilScreen", { perfil, municipio });
  };

  const handleEditPerfil = (rowData: any) => {
    const perfil = produtor?.perfis!.find((p) => p.id === rowData.id);
    navigation.navigate("EditPerfilScreen", { perfil });
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
