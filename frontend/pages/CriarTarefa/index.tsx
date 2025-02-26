import React, { useState } from "react";
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/frontend/routes";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

import { styles } from "./styles";
import { globalStyles } from "@/frontend/globalStyles";

import SetaBackIcon from "../../../assets/images/setaBack.svg";
import RelogioIcon from "../../../assets/images/relogio.svg";
import Badge from "@/frontend/components/Badge";

const PaginaCriarTarefa = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [horario, setHorario] = useState("Nenhum");
  
  // Lista dos integrantes do grupo
  const integrantes = ["Marco", "Bruna", "Mãe", "Pai"];

  const [integranteSelecionado, setIntegranteSelecionado] = useState<string | null>(null)

  const escolherHorario = () => {
    DateTimePickerAndroid.open({
      value: new Date(),
      mode: "time",
      is24Hour: true,
      onChange: (event, selectedDate) => {
        if (selectedDate) {
          const horas = selectedDate.getHours().toString().padStart(2, "0");
          const minutos = selectedDate.getMinutes().toString().padStart(2, "0");
          setHorario(`${horas}:${minutos}`);
        }
      },
    });
  };

  const toggleIntegrante = (nome: string) => {
    setIntegranteSelecionado((prevSelecionado) =>
      prevSelecionado === nome ? null : nome
    );
  };

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
        contentContainerStyle={{ paddingBottom: 80, paddingTop: 80 }} >
        <Text style={styles.label}>NOME</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite aqui..."
          value={nome}
          onChangeText={setNome}
        />

        <View style={[styles.cima, styles.dividir]}>
          <Text style={styles.label}>DESCRIÇÃO</Text>
          <Text style={styles.label}>Opcional</Text>
        </View>
        <TextInput
          style={[styles.input, { minHeight: 100, textAlignVertical: "top" }]}
          placeholder="Até 250 caracteres"
          value={descricao}
          onChangeText={(text) => {
            if (text.length <= 250) {
              setDescricao(text);
            }
          }}
          multiline={true}
          maxLength={250}
          numberOfLines={4}
        />

        <Text style={[styles.label, styles.cima]}>HORÁRIO</Text>

        <View style={styles.dividir}>
          <TouchableOpacity style={styles.botao_horario} onPress={escolherHorario}>
            <RelogioIcon width={16} height={16} color="#FFFFFF" />
            <Text style={styles.botao_horario_texto}>Escolher Horário</Text>
          </TouchableOpacity>

          <View style={styles.horario}>
            <Text style={styles.horario_texto}>Atual:</Text>
            <Text style={styles.roxo}>{horario}</Text>
          </View>
        </View>

        <Text style={[styles.label, styles.cima]}>INTEGRANTES</Text>

        <View style={styles.lista_integrantes}>
        {integrantes.map((integrante) => (
          <Badge
          key={integrante}
          backgroundColor="#CAEAFB"
          iconColor="#144F70"
          text={integrante}
          isSelected={integranteSelecionado === integrante}
          onPress={() => toggleIntegrante(integrante)}
          clicavel={true}
        />
        ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default PaginaCriarTarefa;