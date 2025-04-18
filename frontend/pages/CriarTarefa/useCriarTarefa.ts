import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { doc, getDoc } from "firebase/firestore";

import { RootStackParamList } from "../../routes";
import { criarTarefa, editarTarefa } from "../../../backend/services/tarefas/tarefas.service";
import { Frequencia } from "../../../backend/services/tarefas/types";
import { definirAlarme } from "../../services/CriarAlarme";
import { validarFormulario } from "./validation";
import { montarFrequencia } from "./frequenciaUtils";
import { auth } from "@/backend/services/shared/firebaseConfig";
import { db } from "@/backend/services/shared/firebase";
import { globalStyles } from "@/frontend/globalStyles";
import { getCoresDoTema } from "@/frontend/utils/temaStyles";

const DiasDaSemana = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];

export const useCriarTarefa = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<any>();

  const isEditMode = !!route.params?.task;
  const taskToEdit = route.params?.task;
  const dataReferencia = route.params?.dataReferencia || "";

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [horario, setHorario] = useState("N/A");
  const [alarmeAtivado, setAlarmeAtivado] = useState(false);
  type IntegranteSelecionado = string | { uid: string; nome: string; cor_primaria: string; cor_secundaria: string };
  const [integrantesSelecionados, setIntegrantesSelecionados] = useState<IntegranteSelecionado[]>([]);
  const [integrantesGrupo, setIntegrantesGrupo] = useState<
  { uid: string; nome: string; cor_primaria: string; cor_secundaria: string }[]
>([]);

  const [botaoFrequenciaAtivo, setBotaoFrequenciaAtivo] = useState<number | null>(null);
  const [diasSelecionados, setDiasSelecionados] = useState<string[]>([]);
  const [intervalo, setIntervalo] = useState("");
  const [datasSelecionadas, setDatasSelecionadas] = useState<{ id: number; data: Date | null }[]>([{ id: 1, data: null }]);

  const [loading, setLoading] = useState(false);
  const [erros, setErros] = useState<any>({});

  const capitalize = (s: any): string => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  };

  useEffect(() => {
    
    const carregarIntegrantesDoGrupo = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
    
      const userRef = doc(db, "Usuarios", uid);
      const userSnap = await getDoc(userRef);
    
      if (!userSnap.exists()) return;
    
      const userData = userSnap.data();
      const grupoId = userData.grupoId || uid; // Se não tiver grupoId, usa o próprio UID como fallback
    
      // Agora buscar o GRUPO correto
      const grupoRef = doc(db, "Grupos", grupoId);
      const grupoSnap = await getDoc(grupoRef);
    
      if (!grupoSnap.exists()) return;
    
      const grupoData = grupoSnap.data();
      const integrantes: { uid: string; tipo: string }[] = grupoData.integrantes || [];
    
      const promessas = integrantes.map(async (i) => {
        const userRef = doc(db, "Usuarios", i.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) return null;
    
        const userData = userSnap.data();
    
        const tema = userData.tema || "azul";
        return {
          uid: i.uid,
          nome: userData.apelido || "Desconhecido",
          ...getCoresDoTema(tema),
        };
      });
    
      const resultados = await Promise.all(promessas);
      setIntegrantesGrupo(resultados.filter(Boolean) as any[]);
    };
    

    carregarIntegrantesDoGrupo();
  }, []);

  useEffect(() => {
    if (isEditMode && taskToEdit) {
      setNome(taskToEdit.nome || "");
      setDescricao(taskToEdit.descricao === "Não há descrição para esta tarefa." ? "" : taskToEdit.descricao || "");
      setHorario(taskToEdit.horario || "N/A");
      setAlarmeAtivado(taskToEdit.alarme || false);

      setIntegrantesSelecionados(taskToEdit.integrantes || []);

      if (taskToEdit.frequencia) {
        const freqType = taskToEdit.frequencia.tipo.toLowerCase();
        if (freqType === "diariamente") {
          setBotaoFrequenciaAtivo(0);
          setDiasSelecionados(DiasDaSemana);
        } else if (freqType === "semanal") {
          setBotaoFrequenciaAtivo(1);
          if (taskToEdit.frequencia.diasSemana) {
            const dias = taskToEdit.frequencia.diasSemana.map((d: number) => DiasDaSemana[d]);
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
            const datas = taskToEdit.frequencia.datasEspecificas.map((dataStr: string, index: number) => {
              const [day, month] = dataStr.split("/");
              const date = new Date(new Date().getFullYear(), parseInt(month) - 1, parseInt(day));
              return { id: index + 1, data: date };
            });
            setDatasSelecionadas(datas);
          }
        }
      }
    }
  }, [isEditMode, taskToEdit]);

  const toggleIntegrante = (uid: string) => {
    setIntegrantesSelecionados((prev) =>
      prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]
    );
    setErros((prev: any) => ({ ...prev, integrantes: false }));
  };
  

  const toggleDiaSemana = (dia: string) => {
    setDiasSelecionados((prevDias) =>
      prevDias.includes(dia) ? prevDias.filter((d) => d !== dia) : [...prevDias, dia]
    );
  };

  const escolherHorario = () => {
    DateTimePickerAndroid.open({
      mode: "time",
      is24Hour: true,
      value: new Date(),
      onChange: (_, selectedDate) => {
        if (selectedDate) {
          const horas = selectedDate.getHours().toString().padStart(2, "0");
          const minutos = selectedDate.getMinutes().toString().padStart(2, "0");
          setHorario(`${horas}:${minutos}`);
          setErros((prev: any) => ({ ...prev, horario: false }));
        }
      },
    });
  };

  const escolherData = (id: number) => {
    const selectedDate = new Date();
    setDatasSelecionadas((prevDatas) =>
      prevDatas.map((item) =>
        item.id === id ? { ...item, data: selectedDate } : item
      )
    );
  };

  const adicionarNovaData = () => {
    setDatasSelecionadas((prev) => [...prev, { id: prev.length + 1, data: null }]);
  };

  const removerData = (id: number) => {
    setDatasSelecionadas((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSalvar = async () => {
    const validacao = validarFormulario({
      nome,
      horario,
      integrantesSelecionados,
      botaoFrequenciaAtivo,
      diasSelecionados,
      intervalo,
      datasSelecionadas,
    });

    if (!validacao.ok) {
      setErros(validacao.erros);
      Alert.alert("Erro", validacao.mensagem);
      return;
    }

    const frequencia: Frequencia = montarFrequencia(
      botaoFrequenciaAtivo!,
      diasSelecionados,
      intervalo,
      datasSelecionadas
    );

    const now = new Date();
    const dataCriacao = `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;

      const uid = auth.currentUser?.uid;
      if (!uid) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }
      
      const userRef = doc(db, "Usuarios", uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        Alert.alert("Erro", "Usuário não encontrado.");
        return;
      }
      
      const userData = userSnap.data();
      const grupoId = userData.grupoId || uid;
      

    const integrantesFinal = integrantesSelecionados
    .map(i => typeof i === "string" ? i : i.uid)
    .filter(Boolean);

    const novaTarefa = {
      nome,
      descricao: descricao.trim() !== "" ? descricao : null,
      horario,
      alarme: alarmeAtivado,
      integrantes: integrantesFinal,
      frequencia,
      dataCriacao,
      concluido: false,
      grupoId,
    };

    console.log("Dados a serem salvos:", JSON.stringify(novaTarefa, null, 2));

    try {
      setLoading(true);
      if (isEditMode) {
        const updatedTask = { ...taskToEdit, ...novaTarefa };
        await editarTarefa(updatedTask, dataReferencia);
        Alert.alert("Sucesso", "Tarefa editada com sucesso!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        await criarTarefa(novaTarefa);
        Alert.alert("Sucesso", "Tarefa criada com sucesso!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }

      if (alarmeAtivado) definirAlarme(horario);
    } catch (e) {
      console.error(e);
      Alert.alert("Erro", "Erro ao salvar tarefa.");
    } finally {
      setLoading(false);
    }
  };

  return {
    nome,
    setNome,
    descricao,
    setDescricao,
    horario,
    setHorario,
    alarmeAtivado,
    setAlarmeAtivado,
    integrantesSelecionados,
    setIntegrantesSelecionados,
    toggleIntegrante,
    botaoFrequenciaAtivo,
    setBotaoFrequenciaAtivo,
    diasSelecionados,
    setDiasSelecionados,
    toggleDiaSemana,
    intervalo,
    setIntervalo,
    datasSelecionadas,
    setDatasSelecionadas,
    escolherHorario,
    escolherData,
    adicionarNovaData,
    removerData,
    handleSalvar,
    loading,
    erros,
    isEditMode,
    integrantesGrupo,
  };
};