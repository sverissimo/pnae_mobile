import { HomeScreen } from "../screens/HomeScreen";
import { RelatorioScreen } from "../screens/RelatorioScreen";
import { ProdutorScreen } from "../features/produtor/screens/ProdutorScreen";
import { PerfilScreen } from "../screens/PerfilScreen";
import { useAuth } from "../hooks/useAuth";
import { useSelectProdutor } from "../features/produtor/hooks/useSelectProdutor";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RootStackParamList } from "./types";
import { LogoutComponent } from "../components/Logout";
import { Icon } from "../components/Icon";
import { globalColors } from "../constants/themes";
import {
  HomeWrapped,
  PerfilWrapped,
  ProdutorSelectWraper,
  RelatorioWrapped,
} from "../components/ProdutorSelectWraper";

const { primary, grayscale } = globalColors;
const BottomTabs = createBottomTabNavigator<RootStackParamList>();

//const itemInactiveColor = grayscale[500];
const itemInactiveColor = grayscale[900];
const itemActiveColor = primary[50] || primary[100];
const backgroundHeaderColor = primary[400];

export function TabNavigator() {
  const { logoutHandler } = useAuth();
  const { resetProdutor } = useSelectProdutor();

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
        headerRight: () => <LogoutComponent onLogout={resetProdutor} />,
      }}
    >
      <BottomTabs.Screen
        name="HomeScreen"
        component={HomeWrapped}
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
        component={ProdutorScreen}
        options={{
          title: "Propriedades",
          tabBarIcon: ({ focused }) => createIcon(focused, "building"),
        }}
      />

      <BottomTabs.Screen
        name="PerfilScreen"
        component={PerfilWrapped}
        options={{
          title: "Perfil",
          tabBarIcon: ({ focused }) => createIcon(focused, "document-text"),
        }}
      />
      <BottomTabs.Screen
        name="RelatorioScreen"
        component={RelatorioWrapped}
        options={{
          title: "Relatório",
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
