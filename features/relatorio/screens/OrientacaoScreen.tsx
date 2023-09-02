import { useCustomNavigation } from "@navigation/hooks";
import { TextEditor } from "@shared/components/templates/TextEditor";
import { View, StyleSheet } from "react-native";

export function OrientacaoScreen({ route }: any) {
  const { parentRoute, orientacao } = route.params;
  const { navigation } = useCustomNavigation();

  const handleSave = (HTMLText: string) => {
    navigation.navigate(parentRoute, { HTMLText });
  };

  return (
    <View style={styles.container}>
      <TextEditor handleSave={handleSave} initialHTMLText={orientacao || ""} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
