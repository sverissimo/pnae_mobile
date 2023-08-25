import { View, StyleSheet } from "react-native";
import { Card } from "../@shared/components/organisms/HomeCard";
import { useCustomNavigation } from "../hooks/useCustomNavigation";
import { RootStackParamList } from "../navigation/types";
import { ProdutorInfo } from "../features/produtor/components/ProdutorInfo";

export const HomeScreen: React.FC = () => {
  const { navigation } = useCustomNavigation();
  const pressHandler = (screenName: keyof RootStackParamList) => {
    const screen =
      typeof screenName === "string" ? screenName : screenName.toString();
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <ProdutorInfo />
      <View style={styles.cardsContainer}>
        <Card
          title="Gerenciar Produtores"
          iconName="person"
          onPress={() => pressHandler("ProdutorScreen")}
        />
        <Card
          title="Gerenciar Propriedades"
          iconName="building"
          onPress={() => pressHandler("PropriedadeScreen")}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    //backgroundColor: globalColors.background,
  },
  cardsContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    top: "30%",
  },
});
