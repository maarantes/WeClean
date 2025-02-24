import React from "react";
import { View, Text, ScrollView, SafeAreaView } from "react-native";
import { useFonts } from "../../hooks/UsarFontes";
import { styles } from "./styles";
import { globalStyles } from "@/frontend/globalStyles";

import CardTarefa from "../../components/CardTarefa/index";
import ParteCima from "../../components/ParteCima/index";
import { Navbar } from "@/frontend/components/Navbar";

const SemTarefa = () => (
  <View style={styles.container_sem_tarefa}>
    <Text style={styles.texto_sem_tarefa}>Nenhuma tarefa!</Text>
  </View>
);

const PaginaInicio = () => {
  const fontLoaded = useFonts();

  if (!fontLoaded) {
    return <Text>Carregando...</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>

      <ParteCima />

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

      <Navbar />
      
    </SafeAreaView>
  );
};

export default PaginaInicio;