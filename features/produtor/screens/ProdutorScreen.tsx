import { Text, View, StyleSheet } from "react-native";
import { useSelectProdutor } from "../hooks/useSelectProdutor";
import { ProdutorSearchBar } from "../components/ProdutorSearchBar";
import { ProdutorInfo } from "../components/ProdutorInfo";
import PerfilList from "../../perfil/components/PerfilList";
import { RelatoriosList } from "../../relatorio/components/RelatorioList";

export const ProdutorScreen = () => {
  const { produtor } = useSelectProdutor();
  const a = produtor?.tp_sexo === "F" ? "a" : "";

  return (
    <View style={styles.container}>
      {produtor ? <ProdutorInfo /> : <ProdutorSearchBar />}
      {/* <View>
        <Text>{`Produtor${a}: ${produtor?.nm_pessoa}`} </Text>
      </View> */}
      <PerfilList />
      <RelatoriosList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: globalColors.primary[50],
    alignItems: "center",
  },
});
