import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { MenuProvider } from 'react-native-popup-menu'; // IMPORTA O PROVIDER
import Routes from "./routes";
import { atualizarCalendario } from "../backend/services/calendario/atualizarCalendario";

export default function App() {
  useEffect(() => {
    atualizarCalendario();
  }, []);

  return (
    <MenuProvider>
      <NavigationContainer>
        <Routes />
      </NavigationContainer>
    </MenuProvider>
  );
}