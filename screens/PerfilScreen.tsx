import { Text, View } from "react-native";
import { useContext } from "react";
import { ProdutorContext } from "../contexts/ProdutorContext";
import { useLayoutEffect } from "react";
import { useCustomNavigation } from "../hooks/useCustomNavigation";

export const PerfilScreen = () => {
  const { produtor } = useContext(ProdutorContext);
  const { navigation } = useCustomNavigation();
  useLayoutEffect(() => {
    if (!produtor) {
      navigation.setOptions({
        headerTitle: "Gerenciar produtores",
      });
      navigation.navigate("ProdutorScreen", { title: "Gerenciar produtores" });
    }
  }, [navigation]);

  return (
    <View>
      <Text>PerfilScreen</Text>
    </View>
  );
};
