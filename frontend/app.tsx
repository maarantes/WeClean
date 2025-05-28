import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { MenuProvider } from "react-native-popup-menu";
import { StatusBar } from "expo-status-bar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../backend/services/shared/firebaseConfigApp";
import Routes from "./routes";
import { atualizarCalendario } from "../backend/services/calendario/atualizarCalendario";
import { ActivityIndicator, View } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { UsuarioProvider } from "./context/usuarioContext";

export default function App() {
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("#FFFFFF");
    NavigationBar.setButtonStyleAsync("dark");
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) atualizarCalendario();
      setAuthInitialized(true);
    });
    return unsubscribe;
  }, []);

  if (!authInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#808080" />
      </View>
    );
  }

  return (
    <UsuarioProvider>
      <MenuProvider>
        <StatusBar style="dark" translucent />
        <NavigationContainer>
          <Routes />
        </NavigationContainer>
      </MenuProvider>
    </UsuarioProvider>
  );
}