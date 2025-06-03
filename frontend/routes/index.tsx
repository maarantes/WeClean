import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import PaginaInicio from "../pages/Inicio";
import PaginaTarefas from "../pages/Tarefas";
import PaginaCriarTarefa from "../pages/CriarTarefa";
import PaginaCalendario from "../pages/Calendario";
import PaginaLoginCadastro from "../pages/LoginCadastro";
import PaginaPerfil from "../pages/Perfil";
import PaginaGrupo from "../pages/Grupo";
import PaginaSplash from "../pages/SplashScreen";
import PaginaSugestoes from "../pages/Sugestoes";

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Início: undefined;
  Tarefas: undefined;
  Sugestoes: undefined;
  Calendário: undefined;
  Perfil: undefined;
  Grupo: undefined;
  CriarTarefa: {
    task?: any;
    dataReferencia?: string;
    tipo?: string;
  };
};

const Stack = createStackNavigator<RootStackParamList>();

type RoutesProps = {
  authInitialized: boolean;
  usuarioLogado: string | null;
};

export default function Routes({ authInitialized, usuarioLogado }: RoutesProps) {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: "none",
        presentation: "transparentModal",
      }}
    >
      <Stack.Screen name="Splash">
        {(props) => (
          <PaginaSplash
            {...props}
            authInitialized={authInitialized}
            usuarioLogado={usuarioLogado}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Login" component={PaginaLoginCadastro} />
      <Stack.Screen name="Início" component={PaginaInicio} />
      <Stack.Screen name="Calendário" component={PaginaCalendario} />
      <Stack.Screen name="Tarefas" component={PaginaTarefas} />
      <Stack.Screen name="Sugestoes" component={PaginaSugestoes} />
      <Stack.Screen name="Perfil" component={PaginaPerfil} />
      <Stack.Screen name="Grupo" component={PaginaGrupo} />
      <Stack.Screen name="CriarTarefa" component={PaginaCriarTarefa} />
    </Stack.Navigator>
  );
}