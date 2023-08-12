import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../hooks/useAuth";
import { RootStackParamList } from "./types";
import { TabNavigator } from "./TabNavigator";
import { ProdutorScreen } from "../screens/ProdutorScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function StackNavigator() {
  const { logoutHandler } = useAuth();
  return (
    <Stack.Navigator
      screenOptions={{
        //cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, // Slide animation
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="tabs"
        component={TabNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ProdutorScreen"
        component={ProdutorScreen}
        options={{
          title: "Selecionar Produtor",
        }}
        /* options={{
          title: "Selecione um produtor",
        }} */
      />
    </Stack.Navigator>
  );
}
