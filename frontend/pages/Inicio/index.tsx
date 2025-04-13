import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, SafeAreaView, ActivityIndicator, TouchableOpacity } from "react-native";
import { obterTarefasCalendario } from "../../../backend/services/calendario/obterTarefasCalendario";
import { updateTarefaConcluido } from "../../../backend/services/tarefas/updateTarefaConcluido";
import { useFonts } from "../../hooks/UsarFontes";

import { styles } from "./styles";
import { globalStyles } from "@/frontend/globalStyles";

import { Navbar } from "@/frontend/components/Navbar";
import ParteCima from "../../components/ParteCima/index";
import CardTarefa, { FrequenciaModalTexto } from "../../components/CardTarefa/index";
import AlertaConcluido from "@/frontend/components/AlertaConcluido";
import { useFocusEffect } from "@react-navigation/native";

// Definição dos dias da semana para exibição
const DiasDaSemana = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado"
];

const SemTarefa = () => (
  <View style={styles.container_sem_tarefa}>
    <Text style={styles.texto_sem_tarefa}>Nenhuma tarefa!</Text>
  </View>
);

// Função para parsear uma string "YYYY-MM-DD" em um objeto Date local
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

  const filtrarTarefas = (tarefas: any[]) => {
    switch (filtro) {
      case "pendente":
        return tarefas.filter(t => !t.concluido);
      case "concluido":
        return tarefas.filter(t => t.concluido);
      default:
        return tarefas;
    }
  };

  // Estado para armazenar a última atualização de tarefa (para desfazer)
  const [lastTaskUpdate, setLastTaskUpdate] = useState<{
    id: string;
    dataInst: string;
    prevValue: boolean;
  } | null>(null);

  // Função para carregar as tarefas da semana
  const carregarTarefasSemana = async () => {
    setLoading(true);
    try {
      const tarefasDoCalendario = await obterTarefasCalendario();
      console.log("Tarefas carregadas do Firebase:", tarefasDoCalendario);
      setTarefasSemana(tarefasDoCalendario);
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      // Executa sempre que a tela ganhar foco
      carregarTarefasSemana();
    }, [])
  );

  // Função para desfazer a ação do alerta e reverter a atualização
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

  // Gera as datas da semana atual (de domingo a sábado)
  const today = new Date();
  const dayOfWeek = today.getDay();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - dayOfWeek);
  const weekDates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const formatted = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
      .toString().padStart(2, "0")}-${currentDate.getDate().toString().padStart(2, "0")}`;
    weekDates.push(formatted);
  }

  const formatarDataKey = (dataKey: string): string => {
    const [year, month, day] = dataKey.split("-");
    return `${day}/${month}`;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white", position: "relative" }}>
      <ParteCima />
      {loading ? (
        <ActivityIndicator size="large" color="#5A189A" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView
          style={globalStyles.containerPagina}
          contentContainerStyle={{ paddingBottom: 140, paddingTop: 80 }}>
          
          <Text style={[globalStyles.titulo, globalStyles.mbottom32]}>
            Tarefas da Semana
          </Text>
          
          <View style={styles.wrapper_botao_tipo}>
            <TouchableOpacity
              style={[styles.botao_tipo, filtro === "tudo" && styles.botao_tipo_ativo]}
              onPress={() => setFiltro("tudo")}>
              <Text style={[styles.botao_tipo_texto, filtro === "tudo" && styles.botao_tipo_texto_ativo]}>Tudo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.botao_tipo, filtro === "pendente" && styles.botao_tipo_ativo]}
              onPress={() => setFiltro("pendente")}>
              <Text style={[styles.botao_tipo_texto, filtro === "pendente" && styles.botao_tipo_texto_ativo]}>Pendente</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.botao_tipo, filtro === "concluido" && styles.botao_tipo_ativo]}
              onPress={() => setFiltro("concluido")}>
              <Text style={[styles.botao_tipo_texto, filtro === "concluido" && styles.botao_tipo_texto_ativo]}>Concluído</Text>
            </TouchableOpacity>
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
                        freq_texto={FrequenciaModalTexto(tarefa.frequencia)}
                        integrantes={
                          tarefa.integrantes?.map((integrante: string) => ({
                            nome: integrante,
                            cor_primaria: "#CAEAFB",
                            cor_secundaria: "#144F70"
                          })) || []
                        }
                        concluido={tarefa.concluido}
                        dataInstancia={dataKey}
                        onUpdateConcluido={(dataInst: string, novoValor: boolean) => {
                          setLastTaskUpdate({
                            id: tarefa.id,
                            dataInst,
                            prevValue: !novoValor, // valor anterior: oposto do novo
                          });
                          updateTarefaConcluido(tarefa.id, dataInst, novoValor);
                          setTarefasSemana((prev) => ({
                            ...prev,
                            [dataInst]: prev[dataInst].map((t: any) =>
                              t.id === tarefa.id ? { ...t, concluido: novoValor } : t
                            )
                          }));
                          setAlertMessage(
                            novoValor
                              ? "A tarefa foi concluída"
                              : "A tarefa foi reaberta"
                          );
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

      {/* Alerta fixo na parte de baixo da tela */}
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