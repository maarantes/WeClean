import React from "react";
import { createStackNavigator } from '@react-navigation/stack';

import PaginaInicio from "../pages/Inicio/index"
import PaginaTarefas from "../pages/Tarefas/index";

export type RootStackParamList = {
    Início: undefined;
    Tarefas: undefined;
    Calendário: undefined;
    Perfil: undefined;
}

const Stack = createStackNavigator<RootStackParamList>();

export default function Routes() {
    return (
        <Stack.Navigator initialRouteName="Início" 
        screenOptions={{headerShown: false, animation: "none", presentation: "transparentModal" }}>
            <Stack.Screen name="Início" component={PaginaInicio} />
            <Stack.Screen name="Calendário" component={PaginaTarefas} />
            <Stack.Screen name="Tarefas" component={PaginaTarefas} />
            <Stack.Screen name="Perfil" component={PaginaTarefas} />
        </Stack.Navigator>
  );
}