import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { MenuProvider } from "react-native-popup-menu";
import { StatusBar } from "expo-status-bar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../backend/services/shared/firebaseConfigApp";
import Routes from "./routes";
import { atualizarCalendario } from "../backend/services/calendario/atualizarCalendario";
import * as NavigationBar from "expo-navigation-bar";
import { UsuarioProvider } from "./context/usuarioContext";

export default function App() {
  const [authInitialized, setAuthInitialized] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState<string | null>(null);

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("#FFFFFF");
    NavigationBar.setButtonStyleAsync("dark");

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) atualizarCalendario();
      setUsuarioLogado(user ? user.uid : null);
      setAuthInitialized(true);
    });

    return unsubscribe;
  }, []);

  return (
    <UsuarioProvider>
      <MenuProvider>
        <StatusBar style="dark" translucent />
        <NavigationContainer>
          <Routes authInitialized={authInitialized} usuarioLogado={usuarioLogado} />
        </NavigationContainer>
      </MenuProvider>
    </UsuarioProvider>
  );
}