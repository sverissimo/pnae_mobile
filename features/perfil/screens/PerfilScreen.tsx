import { View, StyleSheet } from "react-native";
import { globalColors } from "../../../constants/themes";
import { ProdutorSearchBar } from "../../produtor/components/ProdutorSearchBar";
import { ProdutorInfo } from "../../produtor/components/ProdutorInfo";
import React from "react";
import { useSelectProdutor } from "../../produtor/hooks/useSelectProdutor";
import PerfilList from "../components/PerfilList";

export const PerfilScreen = () => {
  const { produtor } = useSelectProdutor();

  return (
    <View style={styles.container}>
      {produtor ? <ProdutorInfo /> : <ProdutorSearchBar />}
      <PerfilList />
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
