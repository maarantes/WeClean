import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
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

import {
  criarTarefa as criarTarefaService,
  editarTarefa,
  Frequencia,
} from "@/backend/services/tarefaService";

// Defina a tipagem da rota para esta página
type CriarTarefaRouteProp = RouteProp<RootStackParamList, "CriarTarefa">;

// Função que coloca apenas a primeira letra em maiúscula
const capitalize = (s: any): string => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};

const PaginaCriarTarefa = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<CriarTarefaRouteProp>();
  const [loading, setLoading] = useState(false);

  // Campos da tarefa
  const [nome, setNome] = useState("");
  // Se a descrição for o texto padrão, inicia vazia
  const [descricao, setDescricao] = useState("");
  const [horario, setHorario] = useState("Nenhum");
  const [alarmeAtivado, setAlarmeAtivado] = useState(false);
  const [integrantes] = useState(["Marco", "Bruna", "Mãe", "Pai"]);
  const [frequencias] = useState([
    "Diariamente",
    "Semanalmente",
    "A cada intervalo de tempo",
    "Anualmente em datas específicas",
  ]);

  // Estados para frequência e datas
  const [botaoFrequenciaAtivo, setBotaoFrequenciaAtivo] = useState<number | null>(null);
  const [diasSelecionados, setDiasSelecionados] = useState<string[]>([]);
  const [intervalo, setIntervalo] = useState("");
  const [datasSelecionadas, setDatasSelecionadas] = useState<{ id: number; data: Date | null }[]>([{ id: 1, data: null }]);
  const DiasDaSemana = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];

  // Estados para validação
  const [erroNome, setErroNome] = useState(false);
  const [erroHorario, setErroHorario] = useState(false);
  const [erroIntegrante, setErroIntegrante] = useState(false);
  const [erroFrequencia, setErroFrequencia] = useState(false);
  const [integrantesSelecionados, setIntegrantesSelecionados] = useState<string[]>([]);

  // Modo edição
  const isEditMode = !!route.params?.task;
  const taskToEdit = route.params?.task;
  const dataReferencia = route.params?.dataReferencia || "";

  useEffect(() => {
    console.log("Parâmetros da rota:", route.params);
    if (isEditMode && taskToEdit) {
      setNome(taskToEdit.nome || "");
      // Se a descrição for o texto padrão, inicia vazia
      setDescricao(taskToEdit.descricao === "Não há descrição para esta tarefa." ? "" : taskToEdit.descricao || "");
      setHorario(taskToEdit.horario || "Nenhum");
      setAlarmeAtivado(taskToEdit.alarme || false);
      // Se os integrantes são objetos, extraia o "nome", senão use diretamente
      setIntegrantesSelecionados(
        (taskToEdit.integrantes || []).map((i: any) =>
          typeof i === "string" ? capitalize(i) : capitalize(i.nome)
        )
      );
      // Para a frequência: se houver o objeto "frequencia", use-o; senão, fallback para "freq_texto"
      if (taskToEdit.frequencia) {
        const freqType = taskToEdit.frequencia.tipo.toLowerCase();
        if (freqType === "diariamente") {
          setBotaoFrequenciaAtivo(0);
          setDiasSelecionados(DiasDaSemana);
        } else if (freqType === "semanal") {
          setBotaoFrequenciaAtivo(1);
          if (taskToEdit.frequencia.diasSemana) {
            const dias = taskToEdit.frequencia.diasSemana.map(
              (d: number) => DiasDaSemana[d]
            );
            setDiasSelecionados(dias);
          }
        } else if (freqType === "intervalo") {
          setBotaoFrequenciaAtivo(2);
          if (taskToEdit.frequencia.intervaloDias) {
            setIntervalo(taskToEdit.frequencia.intervaloDias.toString());
          }
        } else if (freqType === "anualmente") {
          setBotaoFrequenciaAtivo(3);
          if (taskToEdit.frequencia.datasEspecificas) {
            const datas = taskToEdit.frequencia.datasEspecificas.map(
              (dataStr: string, index: number) => {
                const [day, month] = dataStr.split("/");
                const date = new Date(new Date().getFullYear(), parseInt(month) - 1, parseInt(day));
                return { id: index + 1, data: date };
              }
            );
            setDatasSelecionadas(datas);
          }
        }
      } else if (taskToEdit.freq_texto) {
        // Fallback caso "frequencia" não exista
        const text = taskToEdit.freq_texto.toLowerCase();
        if (text.includes("diariamente")) {
          setBotaoFrequenciaAtivo(0);
          setDiasSelecionados(DiasDaSemana);
        } else if (text.includes("semanalmente")) {
          setBotaoFrequenciaAtivo(1);
          // Se houver dias, tente recuperá-los (caso taskToEdit.diasSemana exista)
        } else if (text.includes("intervalo")) {
          setBotaoFrequenciaAtivo(2);
        } else if (text.includes("anualmente")) {
          setBotaoFrequenciaAtivo(3);
        }
      }
    }
  }, [isEditMode, taskToEdit]);

  const escolherBotaoFrequencia = (index: number) => {
    setBotaoFrequenciaAtivo(index);
    setErroFrequencia(false);
    if (index === 0) {
      // Diariamente
      setDiasSelecionados(DiasDaSemana);
    } else if (index === 1) {
      // Semanalmente
      setDiasSelecionados([]);
    }
  };

  const toggleDiaSemana = (dia: string) => {
    setDiasSelecionados((prevDias) =>
      prevDias.includes(dia) ? prevDias.filter((d) => d !== dia) : [...prevDias, dia]
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
    const normalized = capitalize(nome);
    setIntegrantesSelecionados((prevSelecionados) =>
      prevSelecionados.includes(normalized)
        ? prevSelecionados.filter((i) => i !== normalized)
        : [...prevSelecionados, normalized]
    );
  };

  const criarTarefa = async () => {
    if (!nome.trim())
      return Alert.alert("Erro", "O nome da tarefa é obrigatório.");
    if (horario === "Nenhum")
      return Alert.alert("Erro", "Escolha um horário para a tarefa.");
    if (integrantesSelecionados.length === 0)
      return Alert.alert("Erro", "Selecione pelo menos um integrante.");
    if (botaoFrequenciaAtivo === null)
      return Alert.alert("Erro", "Escolha uma frequência.");

    let frequencia: Frequencia;
    switch (botaoFrequenciaAtivo) {
      case 0:
        frequencia = {
          tipo: "diariamente",
          diasSemana: [0, 1, 2, 3, 4, 5, 6],
          intervaloDias: null,
          datasEspecificas: null,
        };
        break;
      case 1:
        frequencia = {
          tipo: "semanal",
          diasSemana: diasSelecionados.map((dia) => DiasDaSemana.indexOf(dia)),
          intervaloDias: null,
          datasEspecificas: null,
        };
        break;
      case 2:
        frequencia = {
          tipo: "intervalo",
          diasSemana: null,
          intervaloDias: intervalo ? parseInt(intervalo, 10) : 1,
          datasEspecificas: null,
        };
        break;
      case 3:
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
        frequencia = {
          tipo: "diariamente",
          diasSemana: [0, 1, 2, 3, 4, 5, 6],
          intervaloDias: null,
          datasEspecificas: null,
        };
        break;
    }

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
      concluido: false,
    };

    console.log("Criando/Atualizando Tarefa:", JSON.stringify(novaTarefa, null, 2));
    setLoading(true);

    try {
      if (isEditMode) {
        const updatedTask = { ...taskToEdit, ...novaTarefa };
        await editarTarefa(updatedTask, dataReferencia);
        Alert.alert("Sucesso", "Tarefa editada com sucesso!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        await criarTarefaService(novaTarefa);
        Alert.alert("Sucesso", "Tarefa adicionada com sucesso!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }

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
        <Text style={styles.titulo_cima}>
          {isEditMode ? "Editar Tarefa" : "Criar Nova Tarefa"}
        </Text>
      </View>

      <ScrollView
        style={globalStyles.containerPagina}
        contentContainerStyle={{ paddingBottom: 80, paddingTop: 80 }}
      >
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
          <Text style={{ marginLeft: 10, fontFamily: "Inter-Medium", color: "#606060" }}>
            Ativar alarme para esta tarefa
          </Text>
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
              isSelected={integrantesSelecionados.includes(capitalize(integrante))}
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
        <ScrollView
          style={styles.lista_botoes}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          {frequencias.map((texto, index) => (
            <TouchableOpacity
              key={index}
              style={[
                botaoFrequenciaAtivo === index
                  ? styles.botao_frequencia
                  : styles.botao_frequencia_normal,
                index === frequencias.length - 1 && styles.ultimo,
              ]}
              onPress={() => escolherBotaoFrequencia(index)}
            >
              <Text style={botaoFrequenciaAtivo === index ? styles.branco : styles.roxo}>
                {texto}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {botaoFrequenciaAtivo === 1 && (
          <View style={styles.lista_semanal}>
            {DiasDaSemana.map((texto) => (
              <TouchableOpacity
                key={texto}
                style={
                  diasSelecionados.includes(texto)
                    ? styles.botao_frequencia_semanal
                    : styles.botao_frequencia_semanal_normal
                }
                onPress={() => toggleDiaSemana(texto)}
              >
                <Text style={diasSelecionados.includes(texto) ? styles.branco : styles.roxo}>
                  {texto}
                </Text>
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
              }}
            />
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
                    {item.data
                      ? item.data.toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                        })
                      : "Nenhum"}
                  </Text>
                </View>
              </View>
            ))}
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
              : botaoFrequenciaAtivo === 3 &&
                datasSelecionadas.every((item) => item.data === null)
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
            <Text style={styles.botao_horario_texto}>
              {isEditMode ? "Salvar Alterações" : "Criar Tarefa"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default PaginaCriarTarefa;