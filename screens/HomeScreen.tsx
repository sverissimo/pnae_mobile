// src/screens/HomeScreen/HomeScreen.tsx
import { View, StyleSheet } from "react-native";
import { Card } from "../components/HomeCard";
import { useCustomNavigation } from "../hooks/useCustomNavigation";
import { RootStackParamList } from "../navigation/types";

export const HomeScreen: React.FC = (props: any) => {
  const { navigation } = useCustomNavigation();

  const pressHandler = (screenName: keyof RootStackParamList) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      <Card
        title="Gerenciar Produtores"
        iconName="person"
        onPress={() => pressHandler("ProdutorScreen")}
      />
      <Card
        title="Gerenciar Propriedades"
        iconName="building"
        onPress={() => pressHandler("ProdutorScreen")}
      />
      <Card
        title="Cadastrar Perfil"
        iconName="document-text"
        onPress={() => pressHandler("PerfilScreen")}
      />
      <Card
        title="Cadastrar Relatório"
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
    justifyContent: "center",
    top: "30%",
    //backgroundColor: globalColors.background,
  },
});
