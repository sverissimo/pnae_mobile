import { useMemo } from "react";
import { View, StyleSheet, Text } from "react-native";
import { ProdutorSearchBar } from "../../produtor/components/ProdutorSearchBar";
import { useManagePerfil } from "../hooks/useManagePerfil";
import { useSelectProdutor } from "@features/produtor/hooks";
import { useCustomNavigation } from "@navigation/hooks";
import PerfilList from "../components/PerfilList";
import { ProdutorInfo } from "../../produtor/components/ProdutorInfo";
import { AddButton, ListTitle } from "@shared/components/atoms";
import { globalColors } from "../../../@shared/constants/themes";
import { HelperMessage } from "@shared/components/atoms/HelperMessage";
import { Loading } from "@shared/components/organisms";
import { PerfilDataMapper } from "@services/perfil/mapper/PerfilDataMapper";
import { usePerfilPermissions } from "../hooks/usePerfilPermissions";

export const PerfilScreen = () => {
  const { navigation } = useCustomNavigation();
  const { produtor, isLoading } = useSelectProdutor();
  const { helperMessage } = usePerfilPermissions();
  const { perfis, producaoNaturaForm, producaoIndustrialForm } =
    useManagePerfil();

  const perfilOptionsLoaded = useMemo(() => {
    return producaoIndustrialForm.length && producaoNaturaForm.length;
  }, [producaoIndustrialForm, producaoNaturaForm]);

  const handleCreatePerfil = () => {
    navigation.navigate("CreatePerfilScreen", { parentRoute: "PerfilScreen" });
  };

  const handleViewPerfil = (perfilId: string) => {
    if (!produtor) return console.log("produtor não encontrado");

    const { municipio } = produtor.propriedades![0];
    const perfil =
      produtor.perfis!.find((p) => p.id === perfilId) ??
      produtor.perfis[+perfilId];

    if (!perfil) return console.log("perfil não encontrado");

    const perfilViewModel = new PerfilDataMapper(perfil).modelToViewModel();

    navigation.navigate("ViewPerfilScreen", {
      perfil: perfilViewModel as any,
      municipio,
    });
  };

  const handleEditPerfil = (rowData: any) => {
    const perfil = produtor?.perfis!.find((p) => p.id === rowData.id);
    navigation.navigate("EditPerfilScreen", { perfil });
  };

  if (!produtor) {
    return (
      <View style={styles.container}>
        <ProdutorSearchBar />
        {isLoading && <Loading />}
      </View>
    );
  } else if (!perfilOptionsLoaded) {
    return (
      <HelperMessage message="Conecte-se à internet para opções de criação de perfil" />
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
      <AddButton
        label="Criar Novo Perfil"
        onPress={handleCreatePerfil}
        disabled={!!helperMessage}
      />
      <Text style={styles.helperMessage}>{helperMessage}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalColors.grayscale[50],
    alignItems: "center",
  },
  helperMessage: {
    textAlign: "justify",
    fontStyle: "italic",
    color: globalColors.grayscale[500],
    fontWeight: "bold",
    padding: 20,
    marginHorizontal: "auto",
  },
});
