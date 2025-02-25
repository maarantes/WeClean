import React from "react";
import { Text, ScrollView, SafeAreaView, TouchableOpacity } from "react-native";
import { useFonts } from "../../hooks/UsarFontes";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/frontend/routes";

import { styles } from "./styles";
import { globalStyles } from "@/frontend/globalStyles";

import TarefaIcon from "../../../assets/images/tarefa.svg";
import ParteCima from "@/frontend/components/ParteCima";

import { Navbar } from "@/frontend/components/Navbar";

const PaginaTarefas = () => {
  
  const fontLoaded = useFonts();

  const { navigate } = useNavigation<StackNavigationProp<RootStackParamList>>();

  if (!fontLoaded) {
    return <Text>Carregando...</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>

      <ParteCima />

      <ScrollView
        style={globalStyles.containerPagina}
        contentContainerStyle={{ paddingBottom: 80, paddingTop: 80, flexGrow: 1 }}>
        <Text style={[globalStyles.titulo, globalStyles.mbottom32]}>Tarefas do Grupo</Text>

        <TouchableOpacity style={styles.botao_adicionar}
        onPress={() => navigate("CriarTarefa")}>
          <TarefaIcon width={20} height={20} color={"#5A189A"} />
          <Text style={styles.botao_adicionar_texto}>Criar Nova Tarefa</Text>
        </TouchableOpacity>
      </ScrollView>

      <Navbar />
      
    </SafeAreaView>
  );
};

export default PaginaTarefas;