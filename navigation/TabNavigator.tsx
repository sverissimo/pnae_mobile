import { HomeScreen } from "../screens/HomeScreen";
import { LogoutComponent } from "../components/Logout";
import { useAuth } from "../hooks/useAuth";
import { RelatorioScreen } from "../screens/RelatorioScreen";
import { ProdutorScreen } from "../screens/ProdutorScreen";
import { PerfilScreen } from "../screens/PerfilScreen";
import { useSelectProdutor } from "../hooks/useSelectProdutor";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RootStackParamList } from "./types";
import { Icon } from "../components/Icon";
import { globalColors } from "../constants/colorsPallete";

const BottomTabs = createBottomTabNavigator<RootStackParamList>();

const itemInactiveColor = globalColors.primary100;
const itemActiveColor = globalColors.primary500;

export function TabNavigator() {
  const { logoutHandler } = useAuth();
  const { resetProdutor } = useSelectProdutor();

  return (
    <BottomTabs.Navigator
      screenOptions={{
        headerBackgroundContainerStyle: {
          backgroundColor: "#6a9f6f",
        },

        tabBarActiveTintColor: itemActiveColor,
        tabBarInactiveTintColor: "#333",
        tabBarStyle: {
          //  backgroundColor: "#efe" ,
          backgroundColor: globalColors.primary50,
        },
      }}
    >
      <BottomTabs.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: "Página Inicial",
          headerStyle: {
            //backgroundColor: "#376d5d",
            backgroundColor: globalColors.primary800,
          },
          headerTitleStyle: {
            color: "#fff",
          },
          tabBarIcon: ({ focused }) => (
            <Icon
              iconName="home"
              size={24}
              color={focused ? itemActiveColor : itemInactiveColor}
            />
          ),
          headerRight: () => <LogoutComponent onLogout={resetProdutor} />,
        }}
      />
      <BottomTabs.Screen
        name="ProdutorScreen"
        component={ProdutorScreen}
        options={{
          title: "Gerenciar Produtores",
          tabBarIcon: ({ focused }) => (
            <Icon
              iconName="person"
              size={24}
              color={focused ? itemActiveColor : itemInactiveColor}
            />
          ),
          headerTitleStyle: {},
        }}
      />
      <BottomTabs.Screen
        name="PerfilScreen"
        component={PerfilScreen}
        options={{
          title: "Perfil",
          tabBarIcon: ({ focused }) => (
            <Icon
              iconName="document-text"
              size={24}
              color={focused ? itemActiveColor : itemInactiveColor}
            />
          ),
        }}
      />
      <BottomTabs.Screen
        name="RelatorioScreen"
        component={RelatorioScreen}
        options={{
          title: "Relatório",
          tabBarIcon: ({ focused }) => (
            <Icon
              iconName="pencil-square-o"
              size={24}
              color={focused ? itemActiveColor : itemInactiveColor}
            />
          ),
        }}
      />
    </BottomTabs.Navigator>
  );
}
