import React from "react";
import { Text, ScrollView, SafeAreaView, TouchableOpacity, View } from "react-native";
import { useFonts } from "../../hooks/UsarFontes";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/frontend/routes";

import { styles } from "./styles";
import { globalStyles } from "@/frontend/globalStyles";

import TarefaIcon from "../../../assets/images/tarefa.svg";
import ParteCima from "@/frontend/components/ParteCima";

import { Navbar } from "@/frontend/components/Navbar";
import CardTarefa from "@/frontend/components/CardTarefa";

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
        contentContainerStyle={{ paddingBottom: 140, paddingTop: 80, flexGrow: 1 }}>
        <Text style={[globalStyles.titulo, globalStyles.mbottom32]}>Tarefas do Grupo</Text>

        <TouchableOpacity style={styles.botao_adicionar}
        onPress={() => navigate("CriarTarefa")}>
          <TarefaIcon width={20} height={20} color={"#5A189A"} />
          <Text style={styles.botao_adicionar_texto}>Criar Nova Tarefa</Text>
        </TouchableOpacity>

        <Text style={[globalStyles.textoNormal, globalStyles.mbottom16]}>Diariamente</Text>
        <View style={styles.container_cards}>
          <CardTarefa horario="12:00" exibirBotao={false} />
        </View>

        <Text style={[globalStyles.textoNormal, globalStyles.mbottom16]}>Semanalmente</Text>
        <View style={styles.container_cards}>
          <CardTarefa horario="12:00" exibirBotao={false} freq_semanal="TER, QUI, SEX" />
        </View>

        <Text style={[globalStyles.textoNormal, globalStyles.mbottom16]}>A cada intervalo de tempo</Text>
        <View style={styles.container_cards}>
          <CardTarefa horario="12:00" exibirBotao={false} freq_intervalo={"4"}/>
        </View>

        <Text style={[globalStyles.textoNormal, globalStyles.mbottom16]}>Anualmente</Text>
        <View style={styles.container_cards}>
          <CardTarefa horario="12:00" exibirBotao={false} freq_anual="01/12  ·  02/12  ·  03/12"/>
        </View>
        
      </ScrollView>

      <Navbar />
      
    </SafeAreaView>
  );
};

export default PaginaTarefas;