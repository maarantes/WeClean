import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SvgProps } from "react-native-svg";
import { StyleSheet } from "react-native";

import InicioIcon from "../assets/images/inicio.svg";
import CalendarioIcon from "../assets/images/calendario.svg";
import TarefasIcon from "../assets/images/tarefa.svg";
import PerfilIcon from "../assets/images/perfil.svg";

import PaginaInicio from "./pages/Inicio/index";
import PaginaTarefas from "./pages/Tarefas/index";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function BottomTabs() {

  return (
    <Tab.Navigator
      initialRouteName="Início"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let IconComponent: React.FC<SvgProps>;
          let iconColor = focused ? "#5A189A" : "#404040";

          switch (route.name) {
            case "Início":
              IconComponent = InicioIcon;
              break;
            case "Calendário":
              IconComponent = CalendarioIcon;
              break;
            case "Tarefas":
              IconComponent = TarefasIcon;
              break;
            case "Perfil":
              IconComponent = PerfilIcon;
              break;
            default:
              return null;
          }

          return <IconComponent width={24} height={24} color={iconColor} />;
        },
        tabBarActiveTintColor: "#5A189A",
        tabBarInactiveTintColor: "#404040",
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarActiveBackgroundColor: "transparent",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Início" component={PaginaInicio} />
      <Tab.Screen name="Calendário" component={PaginaTarefas} />
      <Tab.Screen name="Tarefas" component={PaginaTarefas} />
      <Tab.Screen name="Perfil" component={PaginaTarefas} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 0,
    height: 80,
    paddingTop: 10,
    elevation: 20,
  },
  tabLabel: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
    marginTop: 6,
  },
});

export default function Navigation() {
  return (
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen name="Main" component={BottomTabs} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}