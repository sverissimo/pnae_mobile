import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { globalColors } from "../../../constants/themes";
import { useCustomNavigation } from "../../../hooks/useCustomNavigation";
import { useManageRelatorio } from "../hooks/useManageRelatorios";
import { useSelectProdutor } from "../../produtor/hooks/useSelectProdutor";
import { ProdutorSearchBar } from "../../produtor/components/ProdutorSearchBar";
import { ProdutorInfo } from "../../produtor/components/ProdutorInfo";
import { RelatorioList } from "../components/RelatorioList";
import { Relatorio } from "_types/Relatorio";
import { AddButton, ListTitle } from "@shared/components/atoms";

export const RelatorioScreen = () => {
  const { produtor } = useSelectProdutor();
  const { navigation } = useCustomNavigation();
  const { getRelatorios } = useManageRelatorio();
  const [relatorios, setRelatorios] = useState<Relatorio[]>();

  useEffect(() => {
    if (!produtor?.id_pessoa_demeter) {
      return;
    }

    const fetchRelatorios = async () => {
      const relatorios = await getRelatorios(produtor?.id_pessoa_demeter);
      setRelatorios(relatorios);
    };
    fetchRelatorios();
  }, [produtor]);

  const handlePress = () => {
    navigation.navigate("CreateRelatorioScreen", { relatorios });
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
      {relatorios?.length ? (
        <>
          <ListTitle title={"Relatorios cadastrados"} />
          <RelatorioList relatorios={relatorios} />
        </>
      ) : (
        <ListTitle title={"Nenhum relatório cadastrado"} />
      )}
      <AddButton label="Criar Novo Relatório" onPress={handlePress} />
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
