import { Text, View, StyleSheet } from "react-native";
import { useSelectProdutor } from "../hooks/useSelectProdutor";
import { ProdutorSearchBar } from "../components/ProdutorSearchBar";
import { ProdutorInfo } from "../components/ProdutorInfo";

export const ProdutorScreen = () => {
  const { produtor } = useSelectProdutor();
  return (
    <View style={styles.container}>
      {produtor ? <ProdutorInfo /> : <ProdutorSearchBar />}
      <View>
        <Text>These are the prod details: {JSON.stringify(produtor)}</Text>
      </View>
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
