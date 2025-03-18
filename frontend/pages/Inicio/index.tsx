import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, SafeAreaView, ActivityIndicator } from "react-native";
import { obterTarefasCalendario, updateTarefaConcluido } from "@/backend/services/tarefaService";
import { useFonts } from "../../hooks/UsarFontes";

import { styles } from "./styles";
import { globalStyles } from "@/frontend/globalStyles";

import { Navbar } from "@/frontend/components/Navbar";
import ParteCima from "../../components/ParteCima/index";
import CardTarefa, { FrequenciaModalTexto } from "../../components/CardTarefa/index";
import AlertaConcluido from "@/frontend/components/AlertaConcluido";

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

  // Estado do alerta gerenciado no componente pai
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Estado para armazenar a última atualização de tarefa (para desfazer)
  const [lastTaskUpdate, setLastTaskUpdate] = useState<{
    id: string;
    dataInst: string;
    prevValue: boolean;
  } | null>(null);

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

  useEffect(() => {
    const carregarTarefasSemana = async () => {
      setLoading(true);
      try {
        // Obtém as tarefas do Calendário. As chaves dos documentos são datas no formato "YYYY-MM-DD"
        const tarefasDoCalendario = await obterTarefasCalendario();
        console.log("Tarefas carregadas do Firebase:", tarefasDoCalendario);
        setTarefasSemana(tarefasDoCalendario);
      } catch (error) {
        console.error("Erro ao carregar tarefas:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarTarefasSemana();
  }, []);

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
          contentContainerStyle={{ paddingBottom: 140, paddingTop: 80 }}
        >
          <Text style={[globalStyles.titulo, globalStyles.mbottom32]}>
            Tarefas da Semana
          </Text>
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
                {tarefas.length > 0 ? (
                  tarefas.map((tarefa, index) => (
                    <CardTarefa
                      key={index}
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
                        // Armazena a atualização para possibilitar o desfazer
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

      {/* Alerta fixo na parte inferior da tela */}
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