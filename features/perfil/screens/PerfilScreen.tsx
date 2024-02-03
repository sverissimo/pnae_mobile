import { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { ProdutorSearchBar } from "../../produtor/components/ProdutorSearchBar";
import { useManagePerfil } from "../hooks/useManagePerfil";
import { useSelectProdutor } from "@features/produtor/hooks";
import { useCustomNavigation } from "@navigation/hooks";
import PerfilList from "../components/PerfilList";
import { ProdutorInfo } from "../../produtor/components/ProdutorInfo";
import { AddButton, ListTitle } from "@shared/components/atoms";
import { globalColors } from "../../../@shared/constants/themes";
import { HelperMessage } from "@shared/components/atoms/HelperMessage";

export const PerfilScreen = () => {
  const { navigation } = useCustomNavigation();
  const { produtor } = useSelectProdutor();
  const {
    perfis,
    producaoNaturaForm,
    producaoIndustrialForm,
    enableSavePerfil,
    modelToViewModel,
  } = useManagePerfil(produtor);

  const produtorHasNoPropriedades = !produtor?.propriedades?.length;
  const disabled = !enableSavePerfil || produtorHasNoPropriedades;

  const perfilOptionsLoaded =
    producaoIndustrialForm.length && producaoNaturaForm.length;

  const handleCreatePerfil = () => {
    navigation.navigate("CreatePerfilScreen", { parentRoute: "PerfilScreen" });
  };

  const handleViewPerfil = async (perfilId: string) => {
    if (!produtor) return console.log("produtor não encontrado");

    const { municipio } = produtor.propriedades![0];
    const perfil =
      produtor.perfis!.find((p) => p.id === perfilId) ??
      produtor.perfis[+perfilId];

    if (!perfil) return console.log("perfil não encontrado");

    const perfilViewModel = await modelToViewModel(perfil);

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
      </View>
    );
  } else if (!perfilOptionsLoaded) {
    return (
      <HelperMessage message="Conecte-se á internet para opções de criação de perfil" />
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
        disabled={produtorHasNoPropriedades || !enableSavePerfil}
        mode={disabled ? "outlined" : "contained"}
        style={{ marginTop: "2%" }}
      />
      {produtorHasNoPropriedades ? (
        <HelperMessage message="Não é possível criar um novo perfil para um produtor sem propriedades cadastradas no Demeter." />
      ) : !enableSavePerfil ? (
        <HelperMessage message="Não é possível criar um novo perfil para o contrato vigente." />
      ) : null}
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
