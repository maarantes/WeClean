import React from "react";
import { createStackNavigator } from '@react-navigation/stack';

import PaginaInicio from "../pages/Inicio/index"
import PaginaTarefas from "../pages/Tarefas/index";
import PaginaCriarTarefa from "../pages/CriarTarefa/index";
import PaginaCalendario from "../pages/Calendario";

export type RootStackParamList = {
    Início: undefined;
    Tarefas: undefined;
    Calendário: undefined;
    Perfil: undefined;
    CriarTarefa: {
        task?: any;
        dataReferencia?: string;
      };
}

const Stack = createStackNavigator<RootStackParamList>();

export default function Routes() {
    return (
        <Stack.Navigator initialRouteName="Início" 
        screenOptions={{headerShown: false, animation: "none", presentation: "transparentModal" }}>
            <Stack.Screen name="Início" component={PaginaInicio} />
            <Stack.Screen name="Calendário" component={PaginaCalendario} />
            <Stack.Screen name="Tarefas" component={PaginaTarefas} />
            <Stack.Screen name="Perfil" component={PaginaTarefas} />
            <Stack.Screen name="CriarTarefa" component={PaginaCriarTarefa} />
        </Stack.Navigator>
  );
}