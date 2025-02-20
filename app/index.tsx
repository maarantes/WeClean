import React from "react";
import { Text } from "react-native";
import { useFonts } from "./hooks/UsarFontes";

import PaginaHome from "./pages/Home";

const Index = () => {
  const fontLoaded = useFonts();

  if (!fontLoaded) {
    return <Text>Carregando...</Text>;
  }

  return (
    <PaginaHome />
  );
};

export default Index;
