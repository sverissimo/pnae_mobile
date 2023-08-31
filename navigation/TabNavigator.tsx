import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuth } from "../auth/hooks/useAuth";
import { HomeScreen } from "../screens/HomeScreen";
import { ProdutorScreen } from "../features/produtor/screens/ProdutorScreen";
import { PropriedadeScreen } from "../features/propriedade/screens/PropriedadeScreen";
import { PerfilScreen } from "../features/perfil/screens/PerfilScreen";
import { RelatorioScreen } from "../features/relatorio/screens/RelatorioScreen";
import { RootStackParamList } from "./types";
import { LogoutComponent } from "../@shared/components/molecules/Logout";

import { globalColors } from "../@shared/constants/themes";
import { Icon } from "@shared/components/atoms";

const { primary, grayscale } = globalColors;
const itemInactiveColor = grayscale[900];
const itemActiveColor = primary[50] || primary[100];
const backgroundHeaderColor = primary[400];

const BottomTabs = createBottomTabNavigator<RootStackParamList>();

export function TabNavigator() {
  const { logoutHandler } = useAuth();

  return (
    <BottomTabs.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: backgroundHeaderColor,
        },
        headerTintColor: globalColors.text,
        tabBarActiveTintColor: itemActiveColor,
        tabBarInactiveTintColor: itemInactiveColor,
        tabBarStyle: {
          backgroundColor: backgroundHeaderColor,
        },
        headerRight: () => <LogoutComponent onLogout={logoutHandler} />,
      }}
    >
      <BottomTabs.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: "Página Inicial",
          tabBarIcon: ({ focused }) => createIcon(focused, "home"),
        }}
      />

      <BottomTabs.Screen
        name="ProdutorScreen"
        component={ProdutorScreen}
        options={{
          title: "Produtores",
          tabBarIcon: ({ focused }) => createIcon(focused, "person"),
        }}
      />

      <BottomTabs.Screen
        name="PropriedadeScreen"
        component={PropriedadeScreen}
        options={{
          title: "Propriedades",
          tabBarIcon: ({ focused }) => createIcon(focused, "building"),
        }}
      />

      <BottomTabs.Screen
        name="PerfilScreen"
        component={PerfilScreen}
        options={{
          title: "Perfil",
          tabBarIcon: ({ focused }) => createIcon(focused, "document-text"),
        }}
      />
      <BottomTabs.Screen
        name="RelatorioScreen"
        component={RelatorioScreen}
        options={{
          title: "Relatórios",
          tabBarIcon: ({ focused }) => createIcon(focused, "pencil-square-o"),
        }}
      />
    </BottomTabs.Navigator>
  );
}

const createIcon = (focused: boolean, iconName: string) => (
  <Icon
    iconName={iconName}
    size={24}
    color={focused ? itemActiveColor : itemInactiveColor}
  />
);
