import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../auth/hooks/useAuth";
import { RootStackParamList } from "./types";
import { TabNavigator } from "./TabNavigator";
import { ProdutorScreen } from "../features/produtor/screens/ProdutorScreen";
import { CreatePerfilScreen } from "../features/perfil/screens/CreatePerfilScreen";
import { EditPerfilScreen } from "../features/perfil/screens/EditPerfilScreen";
import {
  CreateRelatorioScreen,
  EditRelatorioScreen,
  GetSignatureScreen,
} from "features/relatorio/screens";

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
      />
      <Stack.Screen
        name="CreateRelatorioScreen"
        component={CreateRelatorioScreen}
        options={{
          title: "Criar Novo Relatório",
        }}
      />
      <Stack.Screen
        name="EditRelatorioScreen"
        component={EditRelatorioScreen}
        options={{
          title: "Editar Relatório",
        }}
      />
      <Stack.Screen
        name="GetSignatureScreen"
        component={GetSignatureScreen}
        options={{
          title: "Assinatura do Produtor",
        }}
      />
      <Stack.Screen
        name="CreatePerfilScreen"
        component={CreatePerfilScreen}
        options={{
          title: "Criar Novo Perfil",
        }}
      />
      <Stack.Screen
        name="EditPerfilScreen"
        component={EditPerfilScreen}
        options={{
          title: "Editar Perfil",
        }}
      />
    </Stack.Navigator>
  );
}
