import React, { useState } from "react";
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/frontend/routes";

import { styles } from "./styles";
import { globalStyles } from "@/frontend/globalStyles";

import SetaBackIcon from "../../../assets/images/setaBack.svg"

const PaginaCriarTarefa = () => {

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [texto, setTexto] = useState("");
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>

        <View style={styles.container_cima}>
        <TouchableOpacity style={styles.botao_voltar} onPress={() => navigation.goBack()}>
              <SetaBackIcon width={40} height={16} color={"#808080"} />
            </TouchableOpacity>
            <Text style={styles.titulo_cima}>Criar Nova Tarefa</Text>
        </View>
        <ScrollView
            style={globalStyles.containerPagina}
            contentContainerStyle={{ paddingBottom: 80, paddingTop: 80 }}>

        <Text style={styles.label}>NOME</Text>
        <TextInput
        style={styles.input}
        placeholder="Digite aqui..."
        value={texto}
        onChangeText={setTexto}
        />

        </ScrollView>
      
    </SafeAreaView>
  );
};

export default PaginaCriarTarefa;