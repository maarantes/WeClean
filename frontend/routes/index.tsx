import React from "react";
import { createStackNavigator } from '@react-navigation/stack';

import PaginaInicio from "../pages/Inicio/index"
import PaginaTarefas from "../pages/Tarefas/index";
import PaginaCriarTarefa from "../pages/CriarTarefa/index";
import PaginaCalendario from "../pages/Calendario";
import PaginaLoginCadastro from "../pages/LoginCadastro";
import PaginaPerfil from "../pages/Perfil";
import PaginaGrupo from "../pages/Grupo";

export type RootStackParamList = {
    Login: undefined
    Início: undefined;
    Tarefas: undefined;
    Calendário: undefined;
    Perfil: undefined;
    Grupo: undefined;
    CriarTarefa: {
        task?: any;
        dataReferencia?: string;
      };
}

const Stack = createStackNavigator<RootStackParamList>();

export default function Routes() {
    return (
        <Stack.Navigator initialRouteName="Login"
        screenOptions={{headerShown: false, animation: "none", presentation: "transparentModal" }}>
            <Stack.Screen name="Login" component={PaginaLoginCadastro} />
            <Stack.Screen name="Início" component={PaginaInicio} />
            <Stack.Screen name="Calendário" component={PaginaCalendario} />
            <Stack.Screen name="Tarefas" component={PaginaTarefas} />
            <Stack.Screen name="Perfil" component={PaginaPerfil} />
            <Stack.Screen name="Grupo" component={PaginaGrupo} />
            <Stack.Screen name="CriarTarefa" component={PaginaCriarTarefa} />
        </Stack.Navigator>
  );
}