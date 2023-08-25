import { Text, View, StyleSheet } from "react-native";
import { PropriedadesList } from "../../propriedade/components/PropriedadeList";
import { globalColors } from "../../../constants/themes";
import { ProdutorSearchBar } from "../../produtor/components/ProdutorSearchBar";
import { ProdutorInfo } from "../../produtor/components/ProdutorInfo";
import React from "react";
import { useSelectProdutor } from "../../produtor/hooks/useSelectProdutor";
import { ListTitle } from "@shared/components/atoms";

export const PropriedadeScreen = () => {
  const { produtor } = useSelectProdutor();

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
      {produtor.propriedades?.length ? (
        <>
          <ListTitle title={"Propriedades cadastradas"} />
          <PropriedadesList />
        </>
      ) : (
        <ListTitle title={"Nenhum relatório cadastrado"} />
      )}
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
