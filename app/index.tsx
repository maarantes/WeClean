import React from "react";
import { Text } from "react-native";
import { useFonts } from "./hooks/UsarFontes";

import PaginaInicio from "./pages/Inicio";

const Index = () => {
  const fontLoaded = useFonts();

  if (!fontLoaded) {
    return <Text>Carregando...</Text>;
  }

  return (
    <PaginaInicio />
  );
};

export default Index;
