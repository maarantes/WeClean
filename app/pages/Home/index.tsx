import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useFonts } from "../../hooks/UsarFontes";
import { styles } from "./styles";

import CardTarefa from "../../components/CardTarefa/index";
import ParteCima from "../../components/ParteCima/index";
import { globalStyles } from "@/app/globalStyles";

const SemTarefa = () => (
  <View style={styles.container_sem_tarefa}>
    <Text style={styles.texto_sem_tarefa}>Nenhuma tarefa!</Text>
  </View>
);

const PaginaHome = () => {
  const fontLoaded = useFonts();

  if (!fontLoaded) {
    return <Text>Carregando...</Text>;
  }

  return (
    <View>
      {/* Componente fixo no topo */}
      <ParteCima />

      {/* Conteúdo rolável */}
      <ScrollView
        style={globalStyles.containerPagina}
        contentContainerStyle={{ paddingBottom: 80, paddingTop: 80 }}>
        <Text style={[globalStyles.titulo, globalStyles.mbottom32]}>Sua Semana</Text>

        <Text style={[globalStyles.textoNormal, globalStyles.mbottom16]}>Segunda-Feira</Text>
        <View style={styles.container_dia_semana}>
          <CardTarefa horario="12:00" exibirBotaoConcluir={true} />
        </View>

        <Text style={[globalStyles.textoNormal, globalStyles.mbottom16]}>Terça-Feira</Text>
        <View style={styles.container_dia_semana}>
          <SemTarefa />
        </View>

        <Text style={[globalStyles.textoNormal, globalStyles.mbottom16]}>Quarta-Feira</Text>
        <View style={styles.container_dia_semana}>
          <SemTarefa />
        </View>

        <Text style={[globalStyles.textoNormal, globalStyles.mbottom16]}>Quinta-Feira</Text>
        <View style={styles.container_dia_semana}>
          <CardTarefa horario="12:00" exibirBotaoConcluir={true} />
        </View>

        <Text style={[globalStyles.textoNormal, globalStyles.mbottom16]}>Sexta-Feira</Text>
        <View style={styles.container_dia_semana}>
          <SemTarefa />
        </View>

        <Text style={[globalStyles.textoNormal, globalStyles.mbottom16]}>Sábado</Text>
        <View style={styles.container_dia_semana}>
          <SemTarefa />
        </View>
      </ScrollView>
    </View>
  );
};

export default PaginaHome;
