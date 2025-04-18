import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, SafeAreaView, ActivityIndicator, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import { obterTarefasCalendario } from "../../../backend/services/calendario/obterTarefasCalendario";
import { updateTarefaConcluido } from "../../../backend/services/tarefas/updateTarefaConcluido";
import { useFonts } from "../../hooks/UsarFontes";

import { styles } from "./styles";
import { globalStyles } from "@/frontend/globalStyles";
import { Navbar } from "@/frontend/components/Navbar";
import ParteCima from "../../components/ParteCima/index";
import CardTarefa from "../../components/CardTarefa";
import { formatarFrequenciaTexto } from "@/frontend/utils/formatarFrequencia";
import AlertaConcluido from "@/frontend/components/AlertaConcluido";
import { auth } from "../../../backend/services/shared/firebaseConfig";
import { db } from "@/backend/services/shared/firebase";
import { getCoresDoTema } from "@/frontend/utils/temaStyles";

const DiasDaSemana = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

const SemTarefa = () => (
  <View style={styles.container_sem_tarefa}>
    <Text style={styles.texto_sem_tarefa}>Nenhuma tarefa!</Text>
  </View>
);

const parseLocalDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const PaginaInicio = () => {
  const fontLoaded = useFonts();
  const [tarefasSemana, setTarefasSemana] = useState<{ [data: string]: any[] }>({});
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [filtro, setFiltro] = useState<"tudo" | "pendente" | "concluido">("tudo");

  const [lastTaskUpdate, setLastTaskUpdate] = useState<{
    id: string;
    dataInst: string;
    prevValue: boolean;
  } | null>(null);

  const carregarTarefasSemana = async () => {
    setLoading(true);
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const tarefasDoCalendario = await obterTarefasCalendario();
      const tarefasFiltradasPorGrupo: { [data: string]: any[] } = {};

      for (const [data, tarefas] of Object.entries(tarefasDoCalendario)) {
        const doUsuario = tarefas.filter((t: any) => t.integrantes?.includes(uid));
      
        const tarefasComCores = await Promise.all(
          doUsuario.map(async (t: any) => {
            const integrantesComTema = await Promise.all(
              t.integrantes?.map(async (userId: string) => {
                const userRef = doc(db, "Usuarios", userId);
                const userSnap = await getDoc(userRef);
                const userData = userSnap.exists() ? userSnap.data() : { apelido: "Desconhecido", tema: "azul" };
                const { cor_primaria, cor_secundaria } = getCoresDoTema(userData.tema);
      
                return {
                  uid: userId,
                  nome: userData.apelido,
                  tema: userData.tema,
                  cor_primaria,
                  cor_secundaria,
                };
              }) || []
            );
      
            return {
              ...t,
              integrantes: integrantesComTema
            };
          })
        );
      
        if (tarefasComCores.length > 0) {
          tarefasFiltradasPorGrupo[data] = tarefasComCores;
        }
      }

      setTarefasSemana(tarefasFiltradasPorGrupo);
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { carregarTarefasSemana(); }, []));

  const handleDesfazer = () => {
    if (lastTaskUpdate) {
      updateTarefaConcluido(lastTaskUpdate.id, lastTaskUpdate.dataInst, lastTaskUpdate.prevValue);
      setTarefasSemana((prev) => ({
        ...prev,
        [lastTaskUpdate.dataInst]: prev[lastTaskUpdate.dataInst].map((t: any) =>
          t.id === lastTaskUpdate.id ? { ...t, concluido: lastTaskUpdate.prevValue } : t
        )
      }));
      setShowAlert(false);
      setLastTaskUpdate(null);
    } else {
      setShowAlert(false);
    }
  };

  if (!fontLoaded) return <Text>Carregando fontes...</Text>;

  const today = new Date();
  const startDate = new Date(today);
  const dayOfWeek = today.getDay();
  startDate.setDate(today.getDate() - dayOfWeek);
  const weekDates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const formatted = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, "0")}-${currentDate.getDate().toString().padStart(2, "0")}`;
    weekDates.push(formatted);
  }

  const formatarDataKey = (dataKey: string): string => {
    const [year, month, day] = dataKey.split("-");
    return `${day}/${month}`;
  };

  const filtrarTarefas = (tarefas: any[]) => {
    switch (filtro) {
      case "pendente": return tarefas.filter(t => !t.concluido);
      case "concluido": return tarefas.filter(t => t.concluido);
      default: return tarefas;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white", position: "relative" }}>
      <ParteCima />

      {loading ? (
        <ActivityIndicator size="large" color="#5A189A" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView style={globalStyles.containerPagina} contentContainerStyle={{ paddingBottom: 140, paddingTop: 80 }}>
          <Text style={[globalStyles.titulo, globalStyles.mbottom32]}>Tarefas da Semana</Text>

          <View style={styles.wrapper_botao_tipo}>
            {["tudo", "pendente", "concluido"].map((tipo) => (
              <TouchableOpacity
                key={tipo}
                style={[styles.botao_tipo, filtro === tipo && styles.botao_tipo_ativo]}
                onPress={() => setFiltro(tipo as any)}>
                <Text style={[styles.botao_tipo_texto, filtro === tipo && styles.botao_tipo_texto_ativo]}>
                  {tipo === "tudo" ? "Tudo" : tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {weekDates.map((dataKey) => {
            const dateObj = parseLocalDate(dataKey);
            const nomeDia = DiasDaSemana[dateObj.getDay()];
            const tarefas = tarefasSemana[dataKey] || [];

            return (
              <View key={dataKey} style={globalStyles.mbottom32}>
                <View style={[styles.flex_between, globalStyles.mbottom16]}>
                  <Text style={globalStyles.textoNormal}>{nomeDia}</Text>
                  <Text style={styles.data_dia}>{formatarDataKey(dataKey)}</Text>
                </View>
                <View style={styles.container_gap}>
                  {filtrarTarefas(tarefas).length > 0 ? (
                    filtrarTarefas(tarefas).map((tarefa, index) => (
                      <CardTarefa
                        key={index}
                        id={tarefa.id}
                        nome={tarefa.nome}
                        descricao={tarefa.descricao || "Não há descrição para esta tarefa."}
                        horario={tarefa.horario}
                        exibirBotao={true}
                        alarme={tarefa.alarme}
                        freq_texto={formatarFrequenciaTexto(tarefa.frequencia)}
                        integrantes={tarefa.integrantes || []}
                        concluido={tarefa.concluido}
                        dataInstancia={dataKey}
                        onUpdateConcluido={(dataInst: string, novoValor: boolean) => {
                          setLastTaskUpdate({ id: tarefa.id, dataInst, prevValue: !novoValor });
                          updateTarefaConcluido(tarefa.id, dataInst, novoValor);
                          setTarefasSemana((prev) => ({
                            ...prev,
                            [dataInst]: prev[dataInst].map((t: any) =>
                              t.id === tarefa.id ? { ...t, concluido: novoValor } : t
                            )
                          }));
                          setAlertMessage(novoValor ? "A tarefa foi concluída" : "A tarefa foi reaberta");
                          setShowAlert(true);
                        }}
                        onTaskDeleted={carregarTarefasSemana}
                      />
                    ))
                  ) : (
                    <SemTarefa />
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}

      <AlertaConcluido
        visible={showAlert}
        message={alertMessage}
        onUndo={handleDesfazer}
        onClose={() => setShowAlert(false)}
      />

      <Navbar />
    </SafeAreaView>
  );
};

export default PaginaInicio;