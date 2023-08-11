import { Text, View } from "react-native";
import { useSelectProdutor } from "../hooks/useSelectProdutor";
import { ProdutorSelectScreen } from "./ProdutorSelectScreen";

export const RelatorioScreen = () => {
  const { produtor } = useSelectProdutor();
  console.log("🚀 ~ file: RelatorioScreen.tsx:7 ~ RelatorioScreen ~ produtor:", produtor);

  if (!produtor) {
    return <ProdutorSelectScreen />;
  }

  return (
    <View>
      <Text>RelatorioScreen</Text>
    </View>
  );
};
