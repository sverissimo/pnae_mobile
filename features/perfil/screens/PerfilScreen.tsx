import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
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
  const { perfis, producaoNaturaForm, producaoIndustrialForm, toViewModel } =
    useManagePerfil(produtor);
  const { navigation } = useCustomNavigation();
  const [enableCreatePerfil, setEnableCreatePerfil] = useState<boolean>(false);

  useEffect(() => {
    const perfilOptionsLoaded = !!(
      producaoIndustrialForm.length && producaoNaturaForm.length
    );

    if (!enableCreatePerfil && perfilOptionsLoaded) {
      setEnableCreatePerfil(true);
    }
  }, [producaoIndustrialForm, producaoNaturaForm]);

  const handleCreatePerfil = () => {
    navigation.navigate("CreatePerfilScreen", { parentRoute: "PerfilScreen" });
  };

  const handleViewPerfil = async (perfilId: string) => {
    console.log("🚀 - handleViewPerfil - perfilId:", perfilId);

    if (!produtor) return console.log("produtor não encontrado");

    const { municipio } = produtor.propriedades![0];
    const perfil =
      produtor.perfis!.find((p) => p.id === perfilId) ??
      produtor.perfis[+perfilId];

    if (!perfil) return console.log("perfil não encontrado");
    const perfilViewModel = await toViewModel(perfil);

    navigation.navigate("ViewPerfilScreen", {
      perfil: perfilViewModel,
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

      {enableCreatePerfil ? (
        <AddButton label="Criar Novo Perfil" onPress={handleCreatePerfil} />
      ) : (
        <Text style={styles.text}>
          Conecte-se á internet para opções de criação de perfil
        </Text>
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
  text: {
    color: globalColors.grayscale[500],
    fontSize: 11,
    marginTop: 10,
    fontStyle: "italic",
  },
});
