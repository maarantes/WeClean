import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Routes from "./routes";
import { atualizarCalendario } from "../backend/services/tarefaService";

export default function App() {
  useEffect(() => {
    atualizarCalendario();
  }, []);

  return (
    <NavigationContainer>
      <Routes />
    </NavigationContainer>
  );
}
