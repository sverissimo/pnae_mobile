import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../hooks/useAuth";
import { ProdutorSelectScreen } from "../screens/ProdutorSelectScreen";
import { RootStackParamList } from "./types";
import { TabNavigator } from "./TabNavigator";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function StackNavigator() {
  const { logoutHandler } = useAuth();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="tabs"
        component={TabNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ProdutorSelectScreen"
        component={ProdutorSelectScreen}
        /* options={{
          title: "Selecione um produtor",
        }} */
      />
    </Stack.Navigator>
  );
}
