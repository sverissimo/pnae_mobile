import { View, StyleSheet } from "react-native";
import { globalColors } from "../../../@shared/constants/themes";
import { ProdutorSearchBar } from "../../produtor/components/ProdutorSearchBar";
import { ProdutorInfo } from "../../produtor/components/ProdutorInfo";
import { useSelectProdutor } from "../../produtor/hooks/useSelectProdutor";
import PerfilList from "../components/PerfilList";
import { useCustomNavigation } from "../../../navigation/hooks/useCustomNavigation";
import { AddButton, ListTitle } from "@shared/components/atoms";

export const PerfilScreen = () => {
  const { produtor } = useSelectProdutor();

  const { navigation } = useCustomNavigation();

  const handlePress = () => {
    navigation.navigate("CreatePerfilScreen");
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
      {produtor.relatorios?.length ? (
        <>
          <ListTitle title={"Perfis cadastrados"} />
          <PerfilList />
        </>
      ) : (
        <ListTitle title={"Nenhum perfil cadastrado"} />
      )}

      <AddButton label="Criar Novo Perfil" onPress={handlePress} />
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
