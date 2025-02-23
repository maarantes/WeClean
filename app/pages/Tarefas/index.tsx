import React from "react";
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from "react-native";
import { useFonts } from "../../hooks/UsarFontes";
import { styles } from "./styles";

import CardTarefa from "../../components/CardTarefa/index";
import ParteCima from "../../components/ParteCima/index";
import { globalStyles } from "@/app/globalStyles";

import TarefaIcon from "../../../assets/images/tarefa.svg";

const PaginaTarefas = () => {
  const fontLoaded = useFonts();

  if (!fontLoaded) {
    return <Text>Carregando...</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      
      {/* Componente fixo no topo */}
      <ParteCima />

      {/* Conteúdo rolável */}
      <ScrollView
        style={globalStyles.containerPagina}
        contentContainerStyle={{ paddingBottom: 80, paddingTop: 80 }}>
        <Text style={[globalStyles.titulo, globalStyles.mbottom32]}>Tarefas do Grupo</Text>

        <TouchableOpacity
            style={styles.botao_adicionar} >
            <TarefaIcon width={20} height={20} color={"#5A189A"} />
            <Text style={styles.botao_adicionar_texto} >Criar Nova Tarefa</Text>
        </TouchableOpacity>
    
      </ScrollView>

    </SafeAreaView>
  );
};

export default PaginaTarefas;
