import React, { useState } from "react";
import { ActivityIndicator } from "react-native";
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, TextInput, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/frontend/routes";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import Checkbox from "expo-checkbox";

import { styles } from "./styles";
import { globalStyles } from "@/frontend/globalStyles";
import { definirAlarme } from "@/frontend/services/CriarAlarme";

import SetaBackIcon from "../../../assets/images/setaBack.svg";
import CalendarioMiniIcon from "../../../assets/images/calendario_mini.svg";
import RelogioIcon from "../../../assets/images/relogio.svg";
import TarefaIcon from "../../../assets/images/tarefa.svg";
import Badge from "@/frontend/components/Badge";

import { criarTarefa as criarTarefaService, Frequencia } from "@/backend/services/tarefaService";

const PaginaCriarTarefa = () => {

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [horario, setHorario] = useState("Nenhum");
  const [alarmeAtivado, setAlarmeAtivado] = useState(false);
 
  const [botaoFrequenciaAtivo, setBotaoFrequenciaAtivo] = useState<number | null>(null);
  const [diasSelecionados, setDiasSelecionados] = useState<string[]>([]);
  const [intervalo, setIntervalo] = useState("");
  const [datasSelecionadas, setDatasSelecionadas] = useState<{ id: number; data: Date | null }[]>([
    { id: 1, data: null },
  ]);

  const DiasDaSemana = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];

  const [erroNome, setErroNome] = useState(false);
  const [erroHorario, setErroHorario] = useState(false);
  const [erroIntegrante, setErroIntegrante] = useState(false);
  const [erroFrequencia, setErroFrequencia] = useState(false);

  const escolherBotaoFrequencia = (index: number) => {
    setBotaoFrequenciaAtivo(index);
    setErroFrequencia(false);

    if (index === 0) { // Diariamente
      setDiasSelecionados(DiasDaSemana); // Adiciona todos os dias
    } else if (index === 1) { // Semanalmente
      setDiasSelecionados([]); // Limpa a lista
    }
  };

  const integrantes = ["Marco", "Bruna", "Mãe", "Pai"];
  const frequencias = ["Diariamente", "Semanalmente", "A cada intervalo de tempo", "Anualmente em datas específicas"];

  const [integrantesSelecionados, setIntegrantesSelecionados] = useState<string[]>([]);

  const toggleDiaSemana = (dia: string) => {
    setDiasSelecionados((prevDias) =>
      prevDias.includes(dia)
        ? prevDias.filter((d) => d !== dia)
        : [...prevDias, dia]
    );
  };

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
          setErroHorario(false);
        }
      },
    });
  };

  const escolherData = (id: number) => {
    DateTimePickerAndroid.open({
      value: new Date(),
      mode: "date",
      display: "calendar",
      onChange: (event, selectedDate) => {
        if (selectedDate) {
          setDatasSelecionadas((prevDatas) =>
            prevDatas.map((item) =>
              item.id === id ? { ...item, data: selectedDate } : item
            )
          );
        }
      },
    });
  };

  const adicionarNovaData = () => {
    setDatasSelecionadas((prevDatas) => [
      ...prevDatas,
      { id: prevDatas.length + 1, data: null },
    ]);
  };

  const toggleIntegrante = (nome: string) => {
    setIntegrantesSelecionados((prevSelecionados) =>
      prevSelecionados.includes(nome)
        ? prevSelecionados.filter((integrante) => integrante !== nome)
        : [...prevSelecionados, nome]
    );
  };

  const criarTarefa = async () => {
    if (!nome.trim()) return Alert.alert("Erro", "O nome da tarefa é obrigatório.");
    if (horario === "Nenhum") return Alert.alert("Erro", "Escolha um horário para a tarefa.");
    if (integrantesSelecionados.length === 0) return Alert.alert("Erro", "Selecione pelo menos um integrante.");
    if (botaoFrequenciaAtivo === null) return Alert.alert("Erro", "Escolha uma frequência.");
  
    let frequencia: Frequencia;
  
    switch (botaoFrequenciaAtivo) {
      case 0:
        // Tarefa diária
        frequencia = {
          tipo: "diariamente",
          diasSemana: [0, 1, 2, 3, 4, 5, 6],
          intervaloDias: null,
          datasEspecificas: null,
        };
        break;
      case 1:
        // Tarefa semanal
        frequencia = {
          tipo: "semanal",
          diasSemana: diasSelecionados.map((dia) => DiasDaSemana.indexOf(dia)),
          intervaloDias: null,
          datasEspecificas: null,
        };
        break;
      case 2:
        // Tarefa com intervalo
        frequencia = {
          tipo: "intervalo",
          diasSemana: null,
          intervaloDias: intervalo ? parseInt(intervalo, 10) : 1,
          datasEspecificas: null,
        };
        break;
      case 3:
        // Tarefa anual
        frequencia = {
          tipo: "anualmente",
          diasSemana: null,
          intervaloDias: null,
          datasEspecificas: datasSelecionadas
            .filter((item) => item.data !== null)
            .map((item) =>
              item.data!.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
              })
            ),
        };
        break;
      default:
        // Como fallback, atribuímos uma frequência diária
        frequencia = {
          tipo: "diariamente",
          diasSemana: [0, 1, 2, 3, 4, 5, 6],
          intervaloDias: null,
          datasEspecificas: null,
        };
        break;
    }
  
    // Formata a data de criação utilizando o horário local (YYYY-MM-DD)
    const now = new Date();
    const dataCriacao = `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;
  
    const novaTarefa = {
      nome,
      descricao: descricao.trim() !== "" ? descricao : null,
      horario,
      alarme: alarmeAtivado,
      integrantes: integrantesSelecionados,
      frequencia,
      dataCriacao,
    };
  
    console.log("Criando Tarefa:", JSON.stringify(novaTarefa, null, 2));
    setLoading(true);
  
    try {
      await criarTarefaService(novaTarefa);
      Alert.alert("Sucesso", "Tarefa adicionada com sucesso!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
  
      if (alarmeAtivado) definirAlarme(horario);
    } catch (error) {
      console.error("Erro ao salvar tarefa:", error);
      Alert.alert("Erro", "Falha ao adicionar a tarefa ao Firestore.");
    } finally {
      setLoading(false);
    }
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
          onChangeText={(text) => {
            setNome(text);
            if (erroNome && text.trim() !== "") {
              setErroNome(false);
            }
          }}
        />
        {erroNome && <Text style={styles.erro_texto}>Este campo é obrigatório!</Text>}

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

        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 20 }}>
          <Checkbox
            value={alarmeAtivado}
            onValueChange={setAlarmeAtivado}
            color={alarmeAtivado ? "#115614" : undefined}
          />
          <Text style={{ marginLeft: 10, fontFamily: "Inter-Medium", color: "#606060" }}>Ativar alarme para esta tarefa</Text>
        </View>

        {erroHorario && <Text style={styles.erro_texto}>Este campo é obrigatório!</Text>}

        <Text style={[styles.label, styles.cima]}>INTEGRANTES</Text>

        <View style={styles.lista_integrantes}>
          {integrantes.map((integrante) => (
            <Badge
              key={integrante}
              backgroundColor="#CAEAFB"
              iconColor="#144F70"
              text={integrante}
              isSelected={integrantesSelecionados.includes(integrante)}
              onPress={() => toggleIntegrante(integrante)}
              clicavel={true}
            />
          ))}
        </View>

        {erroIntegrante && <Text style={styles.erro_texto}>Este campo é obrigatório!</Text>}

        <View style={[styles.cima, styles.dividir]}>
          <Text style={styles.label}>FREQUÊNCIA</Text>
          <Text style={styles.label}>Apenas uma opção</Text>
        </View>

        <ScrollView style={styles.lista_botoes} horizontal={true} showsHorizontalScrollIndicator={false}>
          {frequencias.map((texto, index) => (
            <TouchableOpacity
              key={index}
              style={[botaoFrequenciaAtivo === index ? styles.botao_frequencia : styles.botao_frequencia_normal, index === frequencias.length - 1 && styles.ultimo]}
              onPress={() => escolherBotaoFrequencia(index)}>
              <Text style={botaoFrequenciaAtivo === index ? styles.branco : styles.roxo}>{texto}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {botaoFrequenciaAtivo === 1 && (
          <View style={styles.lista_semanal}>
            {DiasDaSemana.map((texto) => (
              <TouchableOpacity
                key={texto}
                style={diasSelecionados.includes(texto) ? styles.botao_frequencia_semanal : styles.botao_frequencia_semanal_normal}
                onPress={() => toggleDiaSemana(texto)}
              >
                <Text style={diasSelecionados.includes(texto) ? styles.branco : styles.roxo}>{texto}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {botaoFrequenciaAtivo === 2 && (
          <View style={styles.lista_intervalo}>
            <Text style={globalStyles.textoNormal}>A cada</Text>
              <TextInput
                style={styles.input_menor}
                keyboardType="numeric"
                value={`${intervalo}`}
                placeholder="0"
                onChangeText={(text) => {
                  const num = text.replace(/[^0-9]/g, "");
                  setIntervalo(num);
                }} />
            <Text style={globalStyles.textoNormal}>dias a partir de hoje</Text>

          </View>
        )}

        {botaoFrequenciaAtivo === 3 && (
          <View>
            {datasSelecionadas.map((item) => (
              <View key={item.id} style={[styles.dividir, styles.cimaMetade]}>
                <TouchableOpacity
                  style={styles.botao_horario}
                  onPress={() => escolherData(item.id)}
                >
                  <CalendarioMiniIcon width={16} height={16} color="#FFFFFF" />
                  <Text style={styles.botao_horario_texto}>Escolher Data</Text>
                </TouchableOpacity>

                <View style={styles.horario}>
                  <Text style={styles.horario_texto}>Atual:</Text>
                  <Text style={styles.roxo}>
                    {item.data ? item.data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) : "Nenhum"}
                  </Text>
                </View>
              </View>
            ))}

            {/* Botão para adicionar nova data */}
            <TouchableOpacity
              style={[styles.botao_add_data, { marginTop: 12 }]}
              onPress={adicionarNovaData}
            >
              <Text style={styles.botao_add_data_texto}>Adicionar Outra Data</Text>
            </TouchableOpacity>
          </View>
        )}

        {erroFrequencia && (
          <Text style={styles.erro_texto}>
            {botaoFrequenciaAtivo === null
              ? "Selecione uma opção de frequência."
              : botaoFrequenciaAtivo === 1 && diasSelecionados.length === 0
              ? "Escolha pelo menos um dia da semana."
              : botaoFrequenciaAtivo === 2 && (!intervalo || Number(intervalo) <= 0)
              ? "Defina um intervalo válido de dias."
              : botaoFrequenciaAtivo === 3 && datasSelecionadas.every((item) => item.data === null)
              ? "Escolha pelo menos uma data."
              : ""}
          </Text>
        )}
      </ScrollView>
      
      <View style={styles.nav_bottom}>
      {loading ? (
        <ActivityIndicator size="large" color="#5A189A" />
      ) : (
      <TouchableOpacity style={styles.botao_horario} onPress={criarTarefa}>
        <TarefaIcon width={16} height={16} color="#FFFFFF" />
        <Text style={styles.botao_horario_texto}>Criar Tarefa</Text>
      </TouchableOpacity>
      )}
      </View>
    </SafeAreaView>
  );
};

export default PaginaCriarTarefa;