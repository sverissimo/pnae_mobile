import { Text, View, StyleSheet } from "react-native";
import { PropriedadesList } from "../../propriedade/components/PropriedadeList";
import { globalColors } from "../../../constants/themes";
import { ProdutorSearchBar } from "../../produtor/components/ProdutorSearchBar";
import { ProdutorInfo } from "../../produtor/components/ProdutorInfo";
import React from "react";
import { useSelectProdutor } from "../../produtor/hooks/useSelectProdutor";

export const PropriedadeScreen = () => {
  const { produtor } = useSelectProdutor();

  return (
    <View style={styles.container}>
      {produtor ? <ProdutorInfo /> : <ProdutorSearchBar />}
      <PropriedadesList />
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
