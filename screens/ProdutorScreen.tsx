import { Text, View } from "react-native";
import { useSelectProdutor } from "../hooks/useSelectProdutor";
import { useLayoutEffect } from "react";
import { useCustomNavigation } from "../hooks/useCustomNavigation";

export const ProdutorScreen = () => {
  const { produtor } = useSelectProdutor();
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
      <Text>ProdutorScreen</Text>
    </View>
  );
};
