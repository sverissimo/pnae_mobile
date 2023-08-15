import { Text, View, StyleSheet } from "react-native";
import { useSelectProdutor } from "../hooks/useSelectProdutor";
import { ProdutorSearchBar } from "../components/ProdutorSearchBar";
import { ProdutorInfo } from "../components/ProdutorInfo";
import PerfilList from "../../perfil/components/PerfilList";
import { RelatorioList } from "../../relatorio/components/RelatorioList";
import { PropriedadesList } from "../../propriedade/components/PropriedadeList";
import { globalColors } from "../../../constants/themes";
import { formatCPF } from "../../../@shared/utils/formatCPF";

export const ProdutorScreen = () => {
  const { produtor } = useSelectProdutor();
  const cpf = formatCPF(produtor?.nr_cpf_cnpj);

  return (
    <View style={styles.container}>
      {produtor ? <ProdutorInfo /> : <ProdutorSearchBar />}
      {produtor && <Text>{`CPF - ${cpf}`} </Text>}
      <PropriedadesList />
      <PerfilList />
      <RelatorioList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalColors.grayscale[50],
    //justifyContent: "flex-end",
    alignItems: "center",
  },
});
