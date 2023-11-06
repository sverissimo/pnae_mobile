import { Text, View, StyleSheet } from "react-native";
import { useAuth } from "@auth/hooks/useAuth";
import { useCustomNavigation } from "@navigation/hooks";
import { RootStackParamList } from "@navigation/types";
import { Card } from "@shared/components/organisms/HomeCard";
import { globalColors } from "@shared/constants/themes";
import { useEffect } from "react";
import { FileService } from "@services/files/FileService";
import { ProdutorService, RelatorioService } from "@services/index";
import { log } from "@shared/utils/log";

export const HomeScreen: React.FC = () => {
  const { navigation } = useCustomNavigation();
  const { user } = useAuth();
  const pressHandler = (screenName: keyof RootStackParamList) => {
    const screen =
      typeof screenName === "string" ? screenName : screenName.toString();
    navigation.navigate(screen);
  };

  useEffect(() => {
    // new ProdutorService().getProdutor("15609048605").then((r) => log(r));
    // new RelatorioService(true).getAllRelatorios().then((r) => {
    //   log(r);
    //   // new FileService().removeDanglingFiles(r);
    // });
  });
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Olá, {user?.nome_usuario}! </Text>
      <Text style={styles.subtitle}>Selecione uma das opções abaixo </Text>
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
          title="Cadastrar Relatório e Foto"
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
  welcomeText: {
    paddingTop: 40,
    paddingBottom: 20,
    // color: globalColors.primary[800],
    color: globalColors.grayscale[900],
    fontSize: 19,
    fontWeight: "400",
  },
  subtitle: {
    color: globalColors.primary[300],
    fontSize: 13,
  },
  cardsContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    top: "20%",
  },
});
