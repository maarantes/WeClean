import React from "react";
import { View, Text } from "react-native";
import { useFonts } from "../../hooks/UsarFontes";
import { styles } from "./styles";

import CardTarefa from "../../components/CardTarefa/index";
import ParteCima from "../../components/ParteCima/index";

const PaginaHome = () => {
  const fontLoaded = useFonts();

  if (!fontLoaded) {
    return <Text>Carregando...</Text>;
  }

  return (
    <View style={styles.container}>
      <ParteCima />
      <CardTarefa horario="12:00" exibirBotaoConcluir={true} />
      <CardTarefa horario="16:00" exibirBotaoConcluir={true} />
    </View>
  );
};

export default PaginaHome;
