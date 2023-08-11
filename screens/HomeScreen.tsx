// src/screens/HomeScreen/HomeScreen.tsx
import { View, StyleSheet } from "react-native";
import { Card } from "../components/HomeCard";
import { useContext } from "react";
import { ProdutorContext } from "../contexts/ProdutorContext";
import { useCustomNavigation } from "../hooks/useCustomNavigation";
import { RootStackParamList } from "../navigation/types";
import { globalColors } from "../constants/colorsPallete";

export const HomeScreen: React.FC = (props: any) => {
  const { navigation } = useCustomNavigation();
  const { produtor } = useContext(ProdutorContext);

  const pressHandler = (screenName: keyof RootStackParamList) => {
    if (!produtor) {
      navigation.navigate("ProdutorSelectScreen");
    } else {
      navigation.navigate(screenName);
    }
  };
  HomeScreen;

  return (
    <View style={styles.container}>
      <Card
        title="Produtor"
        iconName="person"
        onPress={() => pressHandler("ProdutorScreen")}
      />
      <Card
        title="Propriedade"
        iconName="building"
        onPress={() => pressHandler("ProdutorSelectScreen")}
      />
      <Card
        title="Perfil"
        iconName="document-text"
        onPress={() => pressHandler("PerfilScreen")}
      />
      <Card
        title="Relatório"
        iconName="pencil-square-o"
        onPress={() => pressHandler("RelatorioScreen")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    //backgroundColor: "#faffff",
    //backgroundColor: "#6a7f6f",
    backgroundColor: globalColors.primary700,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "25%",
  },
});
