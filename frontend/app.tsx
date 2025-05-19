import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { MenuProvider } from 'react-native-popup-menu';
import Routes from "./routes";
import { atualizarCalendario } from "../backend/services/calendario/atualizarCalendario";
import { StatusBar } from "expo-status-bar";

export default function App() {
  useEffect(() => {
    atualizarCalendario();
  }, []);

  return (
    <MenuProvider>
      <StatusBar style="dark" translucent={true} />
      <NavigationContainer>
        <Routes />
      </NavigationContainer>
    </MenuProvider>
  );
}